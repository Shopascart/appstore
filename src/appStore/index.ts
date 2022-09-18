import VALTIO from "./valtio";
import { IInitialObject, IStore, IState } from "../interface";
import react, { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
/**
 * A function that stores the application state and has methods to operate on it.
 * @param {initialState} IState - The initial state of the store
 */
const appStore  = <T>(initialState: IState<T>): IStore => {
    let state = VALTIO.proxy(initialState);
    const listeners: Set<(state: IState<T>) => void> = new Set();
    let initialized = false;
    let obj: IStore = {
        getState: () => {
            return state;
        },
        setState: (state: IState<T>) => {
            state = state;
            listeners.forEach((listener) => listener(state));
            return obj;
        },
        set: (name: keyof IState<T>, value: any) => {
            if (name in state) {
                state[name] = value;
                listeners.forEach((listener) => listener(state));
            } else {
                throw new Error(
                    `Intented to set ${name} to ${value} but it is not available in the state.`
                );
            }
            return obj;
        },
        get: (name: keyof IState<T>) => {
            if (name in state) {
                return state[name];
            } else {
                throw new Error(`content '${name}' is not available in the state.`);
            }
        },
        subscribe: (listener: (state: IState<T>) => void) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        _subscribe: (state: IState<T>, callback: any) => {
            VALTIO.subscribe(state, callback);
        },
        useSnapshot: () => {
            return VALTIO.useSnapshot(state);
        },
        dispatch: (action: any) => {
            if (typeof action === "function") {
                action(obj);
            } else {
                throw new Error("Action must be a function");
            }
        },
        serverInitialState: (initialState: IState<T>) => {
            if (!initialized) {
                state = VALTIO.proxy(initialState);
                initialized = true;
            }
            return obj;
        },
    };
    return obj;
}


export const useStore = <T>(store: IStore, selector: (state: IState<T>) => any) => {
    return useSyncExternalStore(
        store.subscribe,
        () => store.getState(),
        () => selector(store.getState())
    );
};

export const useStoreState = <T>(store: IStore, selector: (state: IState<T>) => any) => {
    const [state, setState] = useState(() => selector(store.getState()));
    useEffect(() => store.subscribe(() => setState(selector(store.getState()))), [store]);
    return state; 
};

export default appStore;