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
      * @param name The name of the state to set
      * @param value The value of the state to set
      * @deprecated Use action instead
      */
    setState: (state: State) => IStore<State, Actions>;
    /**
     * Set a value in the store
        * @param {string} name - The name of the value to set
    **/
    set: (name: keyof State, value: any) => IStore<State, Actions>;
    /**
     * Get a value from the store
     * @param {string} name - The name of the value to get
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
     * Subscribe to changes in the store.
     * @param {IState} state - The state of the store
     * @param {function} callback - The callback to call when the store changes
     */
    /**
     * Get all actions from the store
     */
    actions: Actions;
    /**
     * Get an action from the store
     */
    action: (name: keyof Actions) => Actions[keyof Actions];
    subscribe: (listener: (state: State) => void) => () => void;
    /**
     * _Subscribe to changes in the store. This is a valtio subscribe method
     * @param {IState} state - The state of the store
     * @param {function} callback - The callback to call when the store changes
     */
    _subscribe: (state: State, callback: any) => void;
    /**
     * Create a snapshot that catches changes to the store state
     */
    useSnapshot: () => State;
    /**
     *  Server Initial State
     */
    /**
     * Dispatch an action to the store
     */
    dispatch: (action: keyof Actions, payload: Payload) => void;
    serverInitialState: (initialState: State) => IStore<State, Actions>;
}

