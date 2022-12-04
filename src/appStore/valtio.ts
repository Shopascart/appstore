import { proxy, useSnapshot, subscribe } from 'valtio';
import { watch } from 'valtio/utils';
import { IStore } from '../interface';


const PROXY = <State>(state: State) => {
    return proxy(state || {}) as State;
};

const USESNAPSHOT = <State>(state: State) => {
    return useSnapshot(state || {}) as State;
};

const SUBSCRIBE = <State>(state: State, callback: any) => {
    return subscribe(state || {}, callback) as State;
};

const WATCH = <State, Actions>(callback: (get: (state: State | any) => IStore<State, Actions>) => void) => {
    return watch(callback);
};


const VALTIO = {
    proxy: PROXY,
    useSnapshot: USESNAPSHOT,
    subscribe: SUBSCRIBE,
    watch: WATCH,
}

export default VALTIO;