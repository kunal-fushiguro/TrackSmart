class ApiReponse {
    statusCode: number;
    Message: string;
    success: boolean;
    data: {};
    constructor(statusCode:number , Message:string , data = {}, success:boolean ) {
      this.statusCode = statusCode;
      this.Message = Message;
      this.success = success;
      this.data = data;
    }
  }
  
  export { ApiReponse };