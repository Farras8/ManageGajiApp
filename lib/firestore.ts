import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Category, Transaction, TransactionType } from "@/types/finance"

const CATEGORIES_COLLECTION = "categories"
const TRANSACTIONS_COLLECTION = "transactions"

export const categoryService = {
    async getAll(): Promise<Category[]> {
        const q = query(collection(db, CATEGORIES_COLLECTION), orderBy("createdAt", "desc"))
        const snapshot = await getDocs(q)
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Category[]
    },

    async getById(id: string): Promise<Category | null> {
        const docRef = doc(db, CATEGORIES_COLLECTION, id)
        const snapshot = await getDoc(docRef)
        if (!snapshot.exists()) return null
        return {
            id: snapshot.id,
            ...snapshot.data(),
            createdAt: snapshot.data().createdAt?.toDate() || new Date(),
        } as Category
    },

    async create(data: Omit<Category, "id" | "createdAt">): Promise<Category> {
        const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
            ...data,
            createdAt: Timestamp.now(),
        })
        return {
            id: docRef.id,
            ...data,
            createdAt: new Date(),
        }
    },

    async update(id: string, data: Partial<Category>): Promise<void> {
        const docRef = doc(db, CATEGORIES_COLLECTION, id)
        await updateDoc(docRef, data)
    },

    async delete(id: string): Promise<void> {
        const docRef = doc(db, CATEGORIES_COLLECTION, id)
        await deleteDoc(docRef)
    },
}

export const transactionService = {
    async getAll(): Promise<Transaction[]> {
        const q = query(collection(db, TRANSACTIONS_COLLECTION), orderBy("date", "desc"))
        const snapshot = await getDocs(q)
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date?.toDate() || new Date(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Transaction[]
    },

    async getById(id: string): Promise<Transaction | null> {
        const docRef = doc(db, TRANSACTIONS_COLLECTION, id)
        const snapshot = await getDoc(docRef)
        if (!snapshot.exists()) return null
        return {
            id: snapshot.id,
            ...snapshot.data(),
            date: snapshot.data().date?.toDate() || new Date(),
            createdAt: snapshot.data().createdAt?.toDate() || new Date(),
        } as Transaction
    },

    async create(data: Omit<Transaction, "id" | "createdAt" | "category">): Promise<Transaction> {
        const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
            ...data,
            date: Timestamp.fromDate(new Date(data.date)),
            createdAt: Timestamp.now(),
        })
        return {
            id: docRef.id,
            ...data,
            createdAt: new Date(),
        }
    },

    async update(id: string, data: Partial<Transaction>): Promise<void> {
        const docRef = doc(db, TRANSACTIONS_COLLECTION, id)
        const updateData: Record<string, unknown> = { ...data }
        if (data.date) {
            updateData.date = Timestamp.fromDate(new Date(data.date))
        }
        delete updateData.category
        await updateDoc(docRef, updateData)
    },

    async delete(id: string): Promise<void> {
        const docRef = doc(db, TRANSACTIONS_COLLECTION, id)
        await deleteDoc(docRef)
    },
}
