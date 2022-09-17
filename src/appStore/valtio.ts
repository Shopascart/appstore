import { proxy, useSnapshot, subscribe } from 'valtio';
import { watch } from 'valtio/utils';
import { IStore, IState } from '../interface';


const PROXY = <T>(state: IState<T>) => {
    return proxy(state);
};

const USESNAPSHOT = <T>(state: IState<T>) => {
    return useSnapshot(state);
};

const SUBSCRIBE = <T>(state: IState<T>, callback: any) => {
    return subscribe(state, callback);
};

const WATCH = <T>(callback: (get: (state: T | any) => IStore) => void) => {
    return watch(callback);
};


const VALTIO = {
    proxy: PROXY,
    useSnapshot: USESNAPSHOT,
    subscribe: SUBSCRIBE,
    watch: WATCH,
}

export default VALTIO;