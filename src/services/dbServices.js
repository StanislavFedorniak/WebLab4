import { collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase"; 

// 1. Читання всіх доступних експедицій (з колекції missions)
export const fetchMissions = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "missions"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Помилка читання місій: ", error);
    return [];
  }
};

// 2. Запис даних космічного корабля для ПОТОЧНОГО користувача
export const saveShipData = async (shipName, fuelLevel) => {
  if (!auth.currentUser) return; // Захист: тільки для авторизованих
  
  try {
    // Створюємо унікальний документ для кожного користувача за його UID
    const shipRef = doc(db, "user_ships", auth.currentUser.uid);
    await setDoc(shipRef, {
      name: shipName,
      fuel: fuelLevel,
      updatedAt: new Date()
    }, { merge: true }); // merge: true оновлює існуючі поля, не видаляючи інші
    console.log("Дані корабля збережено!");
  } catch (error) {
    console.error("Помилка запису корабля: ", error);
  }
};

// 3. Отримання даних корабля ПОТОЧНОГО користувача
export const fetchShipData = async () => {
  if (!auth.currentUser) return null;
  
  try {
    const shipRef = doc(db, "user_ships", auth.currentUser.uid);
    const docSnap = await getDoc(shipRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("Корабель ще не створено");
      return null;
    }
  } catch (error) {
    console.error("Помилка читання корабля: ", error);
    return null;
  }
};
