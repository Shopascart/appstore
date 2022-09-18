export interface IState<T> {
    [key: string]: T;
}

export default interface IStore {
    /**
     * Get the state of the store
     */
    getState: () => IState<any>;
    /**
     * Set the state of the store
     * @param name The name of the state to set
     * @param value The value of the state to set
     */
    setState: (state: IState<any>) => IStore;
    /**
     * Set a value in the store
        * @param {string} name - The name of the value to set
    **/
    set: (name: keyof IState<any>, value: any) => IStore;
    /**
     * Get a value from the store
     * @param {string} name - The name of the value to get
     */
    get: (name: keyof IState<any>) => any;
    /**
     * Subscribe to changes in the store.
     * @param {IState} state - The state of the store
     * @param {function} callback - The callback to call when the store changes
     */
    subscribe: (listener: (state: IState<any>) => void) => () => void;
    /**
     * _Subscribe to changes in the store. This is a valtio subscribe method
     * @param {IState} state - The state of the store
     * @param {function} callback - The callback to call when the store changes
     */
    _subscribe: (state: IState<any>, callback: any) => void;
    /**
     * Create a snapshot that catches changes to the store state
     */
    useSnapshot: (state: IState<any>) => IState<any>;
    /**
     *  Server Initial State
     */
    /**
     * Dispatch an action to the store
     */
    dispatch: (action: any) => void;
    serverInitialState: (initialState: IState<any>) => IStore;
}

export type IInitialObject<T> = {
    data: IState<T>;
};
