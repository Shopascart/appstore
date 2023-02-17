export type Payload = {
    value: any;
    options?: any;
}

export type Action<State> = {
    [key: string]: (_state: State, payload: Payload) => void;
}


export default interface IStore<State, Actions> {
    /**
     * Get the state of the store
     */
    getState: () => State;
    /**
      * Set the state of the store
      * @param state - The state to set
      */
    setState: (state: State) => IStore<State, Actions>;
    /**
     * Set a value in the store
        * @param {string} name - The name of the state to set
        * @param {any} value - The value to set
    **/
    set: (name: keyof State, value: any) => IStore<State, Actions>;
    /**
     * Get a value from the store
     * @param {string} name - The name of the state to get
     */
    get: (name: keyof State) => any;
    /**
     * Get all actions from the store
     * @deprecated Use actions instead
     */
    getActions?: () => Actions;
    /**
        * Get an action from the store
        * @deprecated Use action instead
    */
    getAction?: (name: keyof Actions) => Actions[keyof Actions];
    /**
     * Get all actions from the store
     */
    actions: Actions;
    /**
     * Get an action from the store
     * @deprecated Use actions destructuring or dispatch function instead 
     * @example const { actionName } = useStore().actions;
        store.dispatch('actionName', payload);
     */
    action?: (name: keyof Actions) => Actions[keyof Actions];
    /**
     * Subscribe to changes in the store.
     * @param {function} listener - The callback to call when the store changes
     */
    subscribe: (listener: (state: State) => void) => () => void;
    /**
     * _Subscribe to changes in the store. This is a valtio subscribe method
     * @param {State} state - The state of the store
     * @param {function} callback - The callback to call when the store changes
     */
    _subscribe: (state: State, callback: any) => void;
    /**
     * Create a snapshot that catches changes to the store state
     */
    useSnapshot: () => State;
    /**
     * Dispatch an action to the store
     */
    dispatch: (action: keyof Actions, payload: Payload) => void;
    /**
     *  Server Initial State
     * @param {State} initialState - The initial state of the store
     */
    serverInitialState: (initialState: State) => IStore<State, Actions>;
}

