export class Usurario{
    
    constructor(
        private nombre: string,
        private email: string,
        private password: string,
        private img?: string,
        private role?: string,
        private google?:boolean,
        private _id?: string
    ){}
}