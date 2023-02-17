import VALTIO from "./valtio";
import { IStore, Action, Payload } from "../interface";
import react, { useEffect, useState } from "react";
/**
 * A function that stores the application _state and has methods to operate on it.
 * @param {initialState} state - The initial state of the store
 * @param {actions} actions - The actions to dispatch to the store
 */




const createStore = <State extends object, Actions extends object = {
    [key: string]: (state: State, payload: Payload) => void;
}>({ state, actions, config }: {
    state: State extends object ? State : never;
    actions?: Actions extends object ? Actions : never;
    config?: {
        debug?: boolean;
    };
}) => {
    let _state = VALTIO.proxy<State>(state) as State;
    const listeners: Set<(_state: State) => void> = new Set();
    let initialized = false;
    const setError = (msg: string) => {
        if (!config || config && config.debug) {
            throw new Error(msg);
        }
    }
    let obj: IStore<State, Actions> = {
        getState: () => {
            return _state;
        },
        setState: (state: State) => {
            _state = state;
            listeners.forEach((listener) => listener(_state));
            return obj;
        },
        set: (name: keyof State, value: any) => {
            if (name in _state) {
                _state[name] = value;
                listeners.forEach((listener) => listener(_state));
            } else {
                setError(
                    `The state '${name as string}' does not exist in the store.`
                );
            }
            return obj;
        },
        get: (name: keyof State) => {
            if (name in _state) {
                return _state[name];
            } else {
                setError(`content '${name.toString()}' is not available in the state.`);
            }
        },
        actions: actions ? actions : {} as Actions,
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
        dispatch: (action, payload, ...rest) => {
            const isRestEmpty = rest.length === 0;
            if (!isRestEmpty) {
                setError(`Dispatch '${action.toString()}' does not accept more than 2 arguments.`);
            }
            function isInstanceofPayload(obj: any): obj is Payload {
                if (typeof obj === "object" && obj !== null) {
                    if ("value" in obj) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            if (!isInstanceofPayload(payload)) {
                setError(`Payload must be an object with a 'value' property and an optional 'options' property.`);
            } else {
                if (actions && action in actions) {
                    const actionFunc = actions[action];
                    if (typeof actionFunc === "function") {
                        const actionFuncParamsLength = actionFunc.length;
                        if (actionFuncParamsLength === 1) {
                            actionFunc(payload);
                            listeners.forEach((listener) => listener(_state));
                        } else if (actionFuncParamsLength === 2) {
                            actionFunc(_state, payload);
                            listeners.forEach((listener) => listener(_state));
                        } else {
                            setError(`Action '${action.toString()}' cannot accept more than 2 arguments. If you want to pass more than 2 arguments, use the 'payload' options object property instead.`);
                        }
                    } else {
                        setError(`Action '${action.toString()}' is not a function.`);
                    }
                } else {
                    setError(`Action '${action.toString()}' is not a valid action.`);
                }
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
export function useStore<State, Actions>(store: IStore<State, Actions>): [State, Actions] {
    const [state, setState] = useState(store.getState());
    useEffect(() => {
        store.subscribe(setState);
    }, [store]);
    const actions = store.actions;
    return [state, actions];
}



export { IStore, Action, Payload };
export default createStore;
