import VALTIO from "./valtio";
import { IStore, Action } from "../interface";
import react, {useEffect, useState } from "react";

/**
 * A function that stores the application _state and has methods to operate on it.
 * @param {initialState} state - The initial state of the store
 * @param {actions} actions - The actions to dispatch to the store
 */
const createStore  = <State extends object, Actions extends object>({state, actions}: {
    state: State extends object ? State : never;
    actions: Actions extends object ? Actions : never;
}) => {
    let _state = VALTIO.proxy<State>(state) as State;
    const listeners: Set<(_state: State) => void> = new Set();
    let initialized = false;
    let obj: IStore<State, Actions> = {
        getState: () => {
            return _state;
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
                throw new Error(`content '${name.toString()}' is not available in the _state.`);
            }
        },
        actions: actions,
        action: (name: keyof Actions) => {
            if (actions && name in actions) {
                return actions[name];
            } else {
                throw new Error(`content '${name.toString()}' is not available in the actions.`);
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
        dispatch: (action: keyof Actions, payload) => {
            if (actions && action in actions) {
                const actionFunc = actions[action] as Function;
                const actionFuncParams = actionFunc.length;
                if (actionFuncParams === 1) {
                    actionFunc(_state);
                } else if (actionFuncParams === 2) {
                    actionFunc(_state, payload);
                } else {
                    throw new Error(`Action '${action.toString()}' has an invalid number of parameters. It should have 1 or 2 parameters.`);
                }
                listeners.forEach((listener) => listener(_state));
            }
            else {
                throw new Error(`Action '${action.toString()}' is not a valid action.`);
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


/**
 * 
 * @param store - The store to use
 * @returns - The state and actions of the store
 */
export function useStore<State, Actions>(store: IStore<State, Actions>) : [State, Actions] {
    const [state, setState] = useState(store.getState());
    useEffect(() => {
        store.subscribe(setState);
    }, [store]);
    const actions = store.actions;
    return [state, actions];
}



export {IStore, Action};
export default createStore;
