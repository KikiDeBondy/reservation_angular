import {HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

export function JwtInterceptor (req: any, next: any) {


  if (req.url.includes('/login') || req.url.includes('/register')) {
    return next(req); // Si c'est l'une de ces requêtes, on les laisse passer sans token
  }
  const authToken = JSON.parse(sessionStorage.getItem('user') || 'null')?.token;
    console.log(authToken);



  if (authToken) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return next(clonedRequest); // Passe la requête modifiée au handler suivant
  }

  return next(req); // Si aucun token, on passe la requête sans ajout d'en-tête

}
