//Реализация стора
const createStore = (reducer) => {
    let state = reducer(undefined, { type: "__INIT" });

    let subscribers = [];

    return {
        getState: () => state,
        dispatch: (action) => {
            state = reducer(state, action);
            subscribers.forEach((callback) => callback());
        },
        subscriber: (callback) => subscribers.push(callback),
    };
};

const ACTIONS = {
    ADD_EVENT: "ADD_EVENT",
    REMOVE_EVENT: "REMOVE_EVENT",
    UPDATE_EVENT: "UPDATE_EVENT",
    SORT_EVENT: "SORT_EVENT",

    SUCCESS_LOGIN: "SUCCESS_LOGIN",
};

const actionCreaterAddEvent = (eventInfo) => {
    //const eventInfoFull = fetch('127.0.0.1');
    //prepare

    const eventInfoFull = eventInfo;
    return {
        type: ACTIONS.ADD_EVENT,
        payload: eventInfoFull,
    };
};

const initialStateEvents = {
    eventsWorld: ["Собыйтие 1"],
};

//reducer - чистая функция
//1. не должны быть side-эффектов, т.е. асинхронные запросы,
//2.при передачи одних и техже данных при вызове редюсера получаем один и тот же результат
//immutable
const reducerEvent = (state = initialStateEvents, action) => {
    switch (action.type) {
        case ACTIONS.ADD_EVENT:
            const newPartState = [...state.eventsWorld];
            newPartState.push(action.payload.text);
            const newState = {
                ...state,
                eventsWorld: newPartState,
            };
            return newState;
        case ACTIONS.REMOVE_EVENT:
            const newPartState2 = [...state.eventsWorld];
            let index = newPartState2.indexOf(action.payload.text);
            if (index !== -1) {
                newPartState2.splice(index, 1);
            }

            return {
                ...state,
                eventsWorld: newPartState2,
            };
        case ACTIONS.UPDATE_EVENT:
            return {
                ...state,
                eventsWorld: [action.payload.text],
            };
        case ACTIONS.SORT_EVENT:
            const newPartState3 = [...state.eventsWorld];

            return {
                ...state,
                eventsWorld: newPartState3.sort(),
            };
        default:
            return {
                ...state,
            };
    }
};

const initialStateUsers = {
    users: ["Пользователь 1"],
};

const reducerLogin = (state = initialStateUsers, action) => {
    switch (action.type) {
        case ACTIONS.SUCCESS_LOGIN:
            return { ...state, users: action.payload };

        default:
            return {
                ...state,
            };
    }
};

const combineReducers = (reducersMap) => {
    return (state, action) => {
        const nextState = {};

        Object.entries(reducersMap).forEach(([key, reducer]) => {
            nextState[key] = reducer(state ? state[key] : state, action);
        });

        return nextState;
    };
};

const rootReducer = combineReducers({
    reducerEventSate: reducerEvent,
    reducerUsers: reducerLogin,
});

const store = createStore(rootReducer);

store.subscriber(() => console.log("Изменилися события...."));

console.log("store до", store.getState());

store.dispatch({
    type: "ADD_EVENT",
    payload: {
        text: "Событие 2",
    },
});

store.dispatch(actionCreaterAddEvent({ text: "Событие 88" }));
console.log("store после", store.getState());

store.dispatch({
    type: "REMOVE_EVENT",
    payload: {
        text: "Событие 2",
    },
});
console.log("store после удаления", store.getState());

store.dispatch({
    type: "ADD_EVENT",
    payload: {
        text: "Событие 3",
    },
});
console.log("store после добавления", store.getState());
store.dispatch({
    type: "SORT_EVENT",
});
console.log("store после сортировки", store.getState());

store.dispatch({
    type: "UPDATE_EVENT",
    payload: {
        text: "Событие 344",
    },
});
console.log("store после сортировки", store.getState());
