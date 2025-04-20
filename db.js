// Initialize IndexedDB
const dbName = "HRAppDB";
const storeName = "users";

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "email" });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

const addUser = async (user) => {
  const db = await openDB();
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);
  store.add(user);
};

const getUser = async (email) => {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.get(email);
    request.onsuccess = () => resolve(request.result);
  });
};
