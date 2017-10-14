import {Http, Headers, RequestOptionsArgs, URLSearchParams} from "@angular/http";
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from "rxjs/Rx";

@Injectable()
export class DataService {
  private headers = new Headers({'Content-Type': 'application/json'});
  constructor(private http: Http) {}

  /**
   * @method callAPI
   * @description function to call the api
   * @param options
   */
  callAPI(options: any) {
    let searchParams:URLSearchParams = new URLSearchParams();
    for(var key in options.search){
      searchParams.set(key,options.search[key]);
    }
    return Observable.create((subscriber) => {
      this.http
        .request(options.url, <RequestOptionsArgs>{
          body: options.body,
          method :(options.method || 'get'),
          header: this.headers,
          search:searchParams
        })
        .toPromise()
        .then((res:any) => {
          res = res.json();
          if (res.Status !== 'success') {
            throw Error(res);
          } else {
            res = res.Data;
          }
          subscriber.next(res);
        })
        .catch(err => {
          try { //if response is not an json object
            err = err.json();
          } catch (e) {
            err = {
              Error: {
                Message: 'Something went wrong'
              },
              Status: 'Error'
            }
          }
          subscriber.error(err);
        });
    });
  }
}
