/**
 * Created by dinesh on 26/9/17.
 */
import {Http, Headers, RequestOptionsArgs, URLSearchParams} from "@angular/http";
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/take';
import {Observable} from "rxjs/Rx";
declare var $: any;

@Injectable()
export class DataService {
  private headers = new Headers({'Content-Type': 'application/json'});
  static httpCallCount = 0;

  constructor(private http: Http) {
  }

  /**
   * @method callAPI
   * @description function to call the api
   * @param options
   * @returns {Promise<T>}
   */
  callAPI(options: any) {
    options.showSuccessMessage = _.isUndefined(options.showSuccessMessage) ? true : options.showSuccessMessage;
    options.showErrorMessage = _.isUndefined(options.showErrorMessage) ? true : options.showErrorMessage;
    // let searchParams:URLSearchParams = new URLSearchParams();
    // _.each(options.search,(value,key)=>searchParams.set(key,value));
    return Observable.create((subscriber) => {
      this.setLoader(true);
      this.http
        .request(options.url, <RequestOptionsArgs>{
          body: options.body,
          method :(options.method || 'get'),
          header: this.headers,
          // search:searchParams
        })
        .toPromise()
        .then((res:any) => {
          res = res.json();
          if (options.showSuccessMessage) {
            options.successMessage = _.get(res, 'Data.Message') || options.successMessage;
          } else {
            options.successMessage = null;
          }
          if (res.Status !== 'success') {
            throw Error(res);
          } else {
            res = res.Data;
          }
          if (options.successMessage) {
            this.setNotification(options.successMessage, 'success');
          }
          console.info('Got success in calling the API::' + options.url);
          this.setLoader(false);
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
          if (options.showErrorMessage) {
            options.errorMessage = _.get(err, 'Error.Message') || options.errorMessage;
          } else {
            options.errorMessage = null;
          }
          if (options.errorMessage) {
            this.setNotification(options.errorMessage, 'error');
          }
          console.warn('Error in calling the API::' + options.url);
          console.warn('Error::', err);
          this.setLoader(false);
          subscriber.error(err);
        });
    });
  }
}
