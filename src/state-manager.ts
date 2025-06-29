export const STATES: IState[] = [
    {
        name: "test",
        status: false,
    }
] 

export interface IState 
{
    name: string;
    status: boolean;
}

export interface IStateManager 
{
    setState(state: IState): void;
    getState(): IState;
}