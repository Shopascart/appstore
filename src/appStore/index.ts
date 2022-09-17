import VALTIO from "./valtio";
import { IInitialObject, IStore, IState } from "../interface";
import react, { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
/**
 * A function that stores the application state and has methods to operate on it.
 * @param {initialState} IState - The initial state of the store
 */
const appStore  = <T>(initialState: IState<T>): IStore => {
    let state = VALTIO.proxy(initialState);
    const listeners: Set<() => void> = new Set();
    let initialized = false;
    let obj: IStore = {
        getState: () => {
            return state;
        },
        set: (name: keyof IState<T>, value: any) => {
            if (name in state.data) {
                state[name] = value;
                listeners.forEach((listener) => listener());
            } else {
                throw new Error(
                    `Intented to set ${name} to ${value} but it is not available in the store`
                );
            }
            return obj;
        },
        get: (name: keyof IState<T>) => {
            if (name in state.data) {
                return state[name];
            } else {
                throw new Error(`content data '${name}' is not available in the store`);
            }
        },
        subscribe: (listener: () => void) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        _subscribe: (state: IState<T>, callback: any) => {
            VALTIO.subscribe(state, callback);
        },
        useSnapshot: () => {
            return VALTIO.useSnapshot(state);
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


const serverContext = createContext<IStore | null>(null);
export const useStore = <T>(store: IStore, selector: (state: IState<T>) => any) => {
    useSyncExternalStore(
        store.subscribe,
        () => store.getState(),
        () => selector(useContext(serverContext)!.getState())
    );
};

export default appStore;