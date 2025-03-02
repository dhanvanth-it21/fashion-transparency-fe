import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TileDetial } from '../../features/admin/models/tile.modle';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private serverIp = "localhost:8080";

  constructor(
    private http: HttpClient
  ) { }

  getTilesList(page: number, size: number, sortBy: string, sortDirection: string, search: string = "") {
    let searchText = "";
    if(search !== "") {
      searchText = `&search=${search}`;
    }
    const apiuri = `http://${this.serverIp}/api/tiles/table-details?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}${searchText}`;
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData;
  }

  getTileDetail(id: string) {
    const apiuri =`http://${this.serverIp}/api/tiles/tile-detail/${id}`;
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData
  }

  updateTileDetail(id: string, tile: TileDetial) {
    const apiuri = `http://${this.serverIp}/api/tiles/${id}`;
    const body = tile;
    const returnData: Observable<Object> = this.http.put(apiuri, body);
    return returnData

}


//-----------------------------------------------
getRetailShopsList(page: number, size: number, sortBy: string, sortDirection: string, search: string = "") {
  let searchText = "";
    if(search !== "") {
      searchText = `&search=${search}`;
    }
  const apiuri = `http://${this.serverIp}/api/retailer-shop/table-details?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}${searchText}`
  console.log(apiuri);
  const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData;
}

getRetailShopById(id: string) {
  const apiuri = `http://${this.serverIp}/api/retailer-shop/${id}`;
  const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData
}


}