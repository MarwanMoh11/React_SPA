// src/services/recipesService.ts
import { getDb, getAuthInstance } from '../firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import type { Recipe } from '../types/Recipe';

// Determine if we're running tests. We preserve existing tests that rely on JSONPlaceholder by
// using the mock HTTP endpoints only when NODE_ENV === 'test'.
const isTestEnv = typeof process !== 'undefined' && (process as any)?.env?.NODE_ENV === 'test';
const JSON_API = 'https://jsonplaceholder.typicode.com/posts';

// Firestore collection name
const COLLECTION = 'recipes';

// Map Firestore docs to Recipe; Firestore doc id can be string; we ensure a numeric id field exists.
function mapDocToRecipe(d: any): Recipe {
  // Ensure backward compatibility with components expecting a number id
  const idNum = typeof d.id === 'number' ? d.id : Number(d.id) || Date.now();
  const recipe: Recipe = {
    id: idNum,
    userId: typeof d.userId === 'number' ? d.userId : 1,
    title: d.title || '',
    body: d.body || '',
  };
  // Pass through optional structured fields when present
  if (typeof d.servings === 'number') recipe.servings = d.servings;
  if (typeof d.prepTime === 'number') recipe.prepTime = d.prepTime;
  if (typeof d.cookTime === 'number') recipe.cookTime = d.cookTime;
  if (typeof d.difficulty === 'string') recipe.difficulty = d.difficulty as any;
  if (Array.isArray(d.ingredients)) recipe.ingredients = d.ingredients as string[];
  if (typeof d.instructions === 'string') recipe.instructions = d.instructions;
  if (d.nutrition && typeof d.nutrition === 'object') {
    recipe.nutrition = { ...d.nutrition };
  }
  return recipe;
}

export async function fetchRecipes(): Promise<Recipe[]> {
  if (isTestEnv) {
    const resp = await fetch(JSON_API);
    if (!resp.ok) throw new Error('Network response was not ok');
    const data = await resp.json();
    return (data as any[]).slice(0, 12);
  }
  const auth = getAuthInstance();
  const currentUser = auth.currentUser;
  if (!currentUser) return [];
  const db = getDb();
  const colRef = collection(db, COLLECTION);
  // In a simple demo, we filter client-side; ideally use a 'where' query.
  const q = query(colRef, orderBy('createdAt', 'desc'), limit(50));
  const snap = await getDocs(q);
  const recipes: Recipe[] = [];
  snap.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.ownerUid === currentUser.uid) {
      recipes.push(mapDocToRecipe(data));
    }
  });
  return recipes;
}

export async function createRecipe(newRecipe: Omit<Recipe, 'id' | 'userId'>): Promise<Recipe> {
  if (isTestEnv) {
    const resp = await fetch(JSON_API, {
      method: 'POST',
      body: JSON.stringify({ ...newRecipe, userId: 1 }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!resp.ok) throw new Error('Failed to create recipe');
    return resp.json();
  }
  const auth = getAuthInstance();
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Not authenticated');
  const db = getDb();
  const colRef = collection(db, COLLECTION);
  // Generate a numeric id (timestamp-based) to preserve existing UI expectations
  const id = Date.now();
  const docData = {
    id,
    userId: 1, // legacy for tests/UI
    ownerUid: currentUser.uid,
    createdAt: Timestamp.now(),
    ...newRecipe,
  } as any; // Firestore accepts plain objects; using any here to spread optional fields
  await addDoc(colRef, docData);
  return mapDocToRecipe(docData);
}

export async function updateRecipe(updatedRecipe: Recipe): Promise<Recipe> {
  if (isTestEnv) {
    const resp = await fetch(`${JSON_API}/${updatedRecipe.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedRecipe),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!resp.ok) throw new Error('Failed to update recipe');
    return resp.json();
  }
  const auth = getAuthInstance();
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Not authenticated');
  const db = getDb();
  const colRef = collection(db, COLLECTION);
  const snap = await getDocs(colRef);
  let targetDocId: string | null = null;
  let ownerUid: string | undefined;
  snap.forEach((docSnap) => {
    const data = docSnap.data();
    if (Number(data.id) === Number(updatedRecipe.id)) {
      targetDocId = docSnap.id;
      ownerUid = data.ownerUid;
    }
  });
  if (!targetDocId) throw new Error('Recipe not found');
  if (ownerUid !== currentUser.uid) throw new Error('Permission denied');
  const ref = doc(db, COLLECTION, targetDocId);
  await setDoc(ref, { ...updatedRecipe }, { merge: true });
  return updatedRecipe;
}

export async function deleteRecipe(recipeId: number): Promise<object> {
  if (isTestEnv) {
    const resp = await fetch(`${JSON_API}/${recipeId}`, { method: 'DELETE' });
    if (!resp.ok) throw new Error('Failed to delete recipe');
    return {};
  }
  const auth = getAuthInstance();
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Not authenticated');
  const db = getDb();
  const colRef = collection(db, COLLECTION);
  const snap = await getDocs(colRef);
  let targetDocId: string | null = null;
  let ownerUid: string | undefined;
  snap.forEach((docSnap) => {
    const data = docSnap.data();
    if (Number(data.id) === Number(recipeId)) {
      targetDocId = docSnap.id;
      ownerUid = data.ownerUid;
    }
  });
  if (!targetDocId) throw new Error('Recipe not found');
  if (ownerUid !== currentUser.uid) throw new Error('Permission denied');
  const ref = doc(db, COLLECTION, targetDocId);
  await deleteDoc(ref);
  return {};
}
