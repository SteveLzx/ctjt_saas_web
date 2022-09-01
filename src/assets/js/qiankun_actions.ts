import { initGlobalState, MicroAppStateActions } from 'qiankun';

const initialState = { status: 'login' };

const shareActions: MicroAppStateActions = initGlobalState(initialState);

export default shareActions;
