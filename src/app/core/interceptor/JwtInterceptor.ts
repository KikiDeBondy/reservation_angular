import {HttpHeaders} from "@angular/common/http";

export function JwtInterceptor (req: any, next: any) {
  const authToken = JSON.parse(sessionStorage.getItem('user') || 'null')?.token;
    console.log(authToken);

  if (!authToken) {
    return next(req)
  }
  const headers = new HttpHeaders({
    Authorization: authToken
  })

  const newReq = req.clone({
    headers
  })

  return next(newReq)

}
