export type IPayload<Value, Options> = {
    value: Value;
    options?: Options;
}

export type IAction<IState> = {
    [key: string]: (_state: IState, payload: IPayload<any, any>) => void;
}


export default interface IStore<IState, IActions> {
    /**
     * Get the state of the store
     */
    getState: () => IState;
    /**
      * Set the state of the store
      * @param state - The state to set
      */
    setState: (state: IState) => IStore<IState, IActions>;
    /**
     * Set a value in the store
        * @param {string} name - The name of the state to set
        * @param {any} value - The value to set
    **/
    set: (name: keyof IState, value: any) => IStore<IState, IActions>;
    /**
     * Get a value from the store
     * @param {string} name - The name of the state to get
     */
    get: (name: keyof IState) => any;
    /**
     * Get all actions from the store
     * @deprecated Use actions instead
     */
    getActions?: () => IActions;
    /**
        * Get an action from the store
        * @deprecated Use action instead
    */
    getAction?: (name: keyof IActions) => IActions[keyof IActions];
    /**
     * Get all actions from the store
     */
    actions: IActions;
    /**
     * Get an action from the store
     * @deprecated Use actions destructuring or dispatch function instead 
     * @example const { actionName } = useStore().actions;
        store.dispatch('actionName', payload);
     */
    action?: (name: keyof IActions) => IActions[keyof IActions];
    /**
     * Subscribe to changes in the store.
     * @param {function} listener - The callback to call when the store changes
     */
    subscribe: (listener: (state: IState) => void) => () => void;
    /**
     * _Subscribe to changes in the store. This is a valtio subscribe method
     * @param {IState} state - The state of the store
     * @param {function} callback - The callback to call when the store changes
     */
    _subscribe: (state: IState, callback: any) => void;
    /**
     * Create a snapshot that catches changes to the store state
     */
    useSnapshot: () => IState;
    /**
     * Dispatch an action to the store
     */
    dispatch: (action: keyof IActions, payload: IPayload<any, any>) => void;
    /**
     *  Server Initial IState
     * @param {IState} initialState - The initial state of the store
     */
    serverInitialState: (initialState: IState) => IStore<IState, IActions>;
}

