export interface IScene 
{
    status: boolean;
}

export interface ISceneManager 
{
    setScene(scene: IScene): void;
    getScene(): IScene;
}