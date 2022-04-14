import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getFirestore,
    onSnapshot,
    query,
    setDoc,
    updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC4vfMfMZuZ18gGI3vHreDjASb5WKqJZHs",
    authDomain: "uni-event-booking-cross-app.firebaseapp.com",
    projectId: "uni-event-booking-cross-app",
    storageBucket: "uni-event-booking-cross-app.appspot.com",
    messagingSenderId: "885906491902",
    appId: "1:885906491902:web:18ab6d72f894ce3f03d8af",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

const authUser = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password).then(async (res) =>
        getDoc(doc(db, `users/${res.user.uid}`))
    );
};

const createUser = async (email, password) => {
    const data = await createUserWithEmailAndPassword(auth, email, password);
    return setDoc(doc(db, `users/${data.user.uid}`), {
        email,
        uid: data.user.uid,
        isSuper: false,
    });
};

const subscribeToEvents = async (onAdded, onRemoved, onModified) => {
    return onSnapshot(query(collection(db, "events")), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") onAdded(change.doc);
            if (change.type === "modified") onModified(change.doc);
            if (change.type === "removed") onRemoved(change.doc);
        });
    });
};

const subscribeToVenues = async (onAdded, onRemoved, onModified) => {
    return onSnapshot(query(collection(db, "venues")), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") onAdded(change.doc);
            if (change.type === "modified") onModified(change.doc);
            if (change.type === "removed") onRemoved(change.doc);
        });
    });
};

const subscribeToAttendees = async (event, onAdded, onRemoved) => {
    return onSnapshot(query(collection(db, `events/${event}/attendees`)), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") onAdded(change.doc);
            if (change.type === "removed") onRemoved(change.doc);
        });
    });
};

const joinEvent = async (user, event) => {
    await setDoc(doc(db, `events/${event}/attendees/${user}`), { user });
    return setDoc(doc(db, `users/${user}/participation/${event}`), { event });
};

const leaveEvent = async (user, event) => {
    await deleteDoc(doc(db, `events/${event}/attendees/${user}`));
    return deleteDoc(doc(db, `users/${user}/participation/${event}`));
};

const submitEventRequest = async (event) => {
    await setDoc(doc(db, `requests/${event.uid}`), event);
    return setDoc(doc(db, `users/${event.user}/requests/${event.uid}`), event);
};

const subscribeToRequests = async (onAdded, onRemoved, onModified) => {
    return onSnapshot(query(collection(db, "requests")), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") onAdded(change.doc);
            if (change.type === "modified") onModified(change.doc);
            if (change.type === "removed") onRemoved(change.doc);
        });
    });
};

const acceptEvent = async (event) => {
    await updateDoc(doc(db, `users/${event.user}/requests/${event.id}`), { state: "ACCEPTED" });
    await setDoc(doc(db, `events/${event.id}`), event);
    return deleteDoc(doc(db, `requests/${event.id}`));
};

const refuseEvent = async (event) => {
    await updateDoc(doc(db, `users/${event.user}/requests/${event.id}`), { state: "REFUSED" });
    return deleteDoc(doc(db, `requests/${event.id}`));
};

const addVenue = async (venue) => {
    return setDoc(doc(db, `venues/${venue.id}`), venue);
};

const getRequestData = async (uid) => {
    return (await getDoc(doc(db, `requests/${uid}`))).data();
};

const getEventData = async (uid) => {
    return (await getDoc(doc(db, `events/${uid}`))).data();
};

const subscribeToMyRequests = async (user, onAdded, onRemoved) => {
    return onSnapshot(query(collection(db, `users/${user}/requests`)), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                getRequestData(change.doc.id).then((data) => {
                    if (data) onAdded(data, change.doc.id);
                });
            }
            if (change.type === "removed") onRemoved(change.doc.id);
        });
    });
};

const subscribeToMyParticipations = async (user, onAdded, onRemoved) => {
    return onSnapshot(query(collection(db, `users/${user}/participation`)), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                getEventData(change.doc.id).then((data) => {
                    if (data) onAdded(data, change.doc.id);
                });
            }
            if (change.type === "removed") onRemoved(change.doc.id);
        });
    });
};

export {
    authUser,
    createUser,
    subscribeToEvents,
    subscribeToVenues,
    subscribeToAttendees,
    subscribeToRequests,
    joinEvent,
    leaveEvent,
    submitEventRequest,
    acceptEvent,
    refuseEvent,
    addVenue,
    subscribeToMyRequests,
    subscribeToMyParticipations,
};
