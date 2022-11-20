import VALTIO from "./valtio";
import { IStore, Action } from "../interface";
import react, { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";

/**
 * A function that stores the application _state and has methods to operate on it.
 * @param {initialState} _state - The initial _state of the store
 * @param {actions} actions - The actions to dispatch to the store
 */
const appStore  = <State, Actions>({state, actions}: {
    state: State;
    actions: Actions;
}) => {
    let _state = VALTIO.proxy<State>(state) as State;
    const listeners: Set<(_state: State) => void> = new Set();
    let initialized = false;
    let obj: IStore<State, Actions> = {
        getState: () => {
            return _state;
        },
        getActions: () => {
            return actions as Actions;
        },
        setState: (_state: State) => {
            _state = _state;
            listeners.forEach((listener) => listener(_state));
            return obj;
        },
        set: (name: keyof State, value: any) => {
            if (name in _state) {
                _state[name] = value;
                listeners.forEach((listener) => listener(_state));
            } else {
                throw new Error(
                    `The state '${name as string}' does not exist in the store.`
                );
            }
            return obj;
        },
        get: (name: keyof State) => {
            if (name in _state) {
                return _state[name];
            } else {
                throw new Error(`content '${name as string}' is not available in the _state.`);
            }
        },
        getAction: (name: keyof Actions) => {
            if (actions && name in actions) {
                return actions[name];
            } else {
                throw new Error(`content '${name as string}' is not available in the actions.`);
            }
        },
        subscribe: (listener: (_state: State) => void) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        _subscribe: (_state: State, callback: any) => {
            VALTIO.subscribe(_state, callback);
        },
        useSnapshot: () => {
            return VALTIO.useSnapshot<State>(_state) as State;
        },
        dispatch: (action, payload) => {
            if (actions && action in actions) {
                const actionsObj = actions as Action<State>;
                actionsObj[action](_state, payload);
                listeners.forEach((listener) => listener(_state));
            }
            else {
                throw new Error(`Action '${action}' is not a valid action.`);
            }
        },
        serverInitialState: (initialState: State) => {
            if (!initialized) {
                _state = VALTIO.proxy(initialState);
                initialized = true;
            }
            return obj;
        },
    };
    return obj;
}




export {IStore, Action};
export default appStore;
