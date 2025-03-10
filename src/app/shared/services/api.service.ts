import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TileDetial } from '../../features/admin/models/tile.modle';
import { FormGroup } from '@angular/forms';


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
    if (search !== "") {
      searchText = `&search=${search}`;
    }
    const apiuri = `http://${this.serverIp}/api/tiles/table-details?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}${searchText}`;
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData;
  }

  getTileDetail(id: string) {
    const apiuri = `http://${this.serverIp}/api/tiles/tile-detail/${id}`;
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
    if (search !== "") {
      searchText = `&search=${search}`;
    }
    const apiuri = `http://${this.serverIp}/api/retailer-shop/table-details?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}${searchText}`
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData;
  }

  getRetailShopById(id: string) {
    const apiuri = `http://${this.serverIp}/api/retailer-shop/${id}`;
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData
  }

  postNewRetailShop(formGroup: any) {
    const apiuri = `http://${this.serverIp}/api/retailer-shop`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const returnData: Observable<Object> = this.http.post(apiuri, formGroup, {headers});
    return returnData;
  }

  updateRetailShopById(id: string, formGroup: any) {
    const apiuri = `http://${this.serverIp}/api/retailer-shop/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const returnData: Observable<Object> = this.http.put(apiuri, formGroup, {headers});
    return returnData;
  }
  
  postDamageReport(formGroup: any) {
    const apiuri = `http://${this.serverIp}/api/damage-report`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const returnData: Observable<Object> = this.http.post(apiuri, formGroup, {headers});
    return returnData;
  }

  //-----------------------------------------------
  getSuppliersList(page: number, size: number, sortBy: string, sortDirection: string, search: string = "") {
    let searchText = "";
    if (search !== "") {
      searchText = `&search=${search}`;
    }
    const apiuri = `http://${this.serverIp}/api/supplier/table-details?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}${searchText}`
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData;
  }

  getSupplierById(id: string) {
    const apiuri = `http://${this.serverIp}/api/supplier/${id}`;
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData
  }


  postNewSupplier(formGroup: any) {
    const apiuri = `http://${this.serverIp}/api/supplier`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const returnData: Observable<Object> = this.http.post(apiuri, formGroup, {headers});
    return returnData;
  }


  updateSupplierById(id: string, formGroup: any) {
    const apiuri = `http://${this.serverIp}/api/supplier/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const returnData: Observable<Object> = this.http.put(apiuri, formGroup, {headers});
    return returnData;
  }
  //-----------------------------------------------
  getShopsFromOrder(search: string) {
    
    const apiuri = `http://${this.serverIp}/api/order/search?search=${search}`;
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData;
  }

  getManufacturers(search: string) {
    const apiuri = `http://${this.serverIp}/api/purchase/search?search=${search}`;
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData;
  }

  getShops(search: string) {
    
    const apiuri = `http://${this.serverIp}/api/retailer-shop/search?search=${search}`;
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData;
  }
  
  getTiles(search: string, location: string = "", givenId: string = "", brandName: string = "") {
    let searchLocation = "";
    if(location !== "") {
      searchLocation = `&location=${location}&givenId=${givenId}`;
    }
    let searchForBrandName = "";
    if(brandName !== "") {
      searchForBrandName = `&brandName=${brandName}`;
    }
    const apiuri = `http://${this.serverIp}/api/tiles/search?search=${search}${searchLocation}${searchForBrandName}`;
    console.log(apiuri);
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData;
  }

  //----------------------------------------------------

  postNewOrder(order: any) {
    const apiuri = `http://${this.serverIp}/api/order`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const returnData: Observable<Object> = this.http.post(apiuri, order, { headers });
    return returnData;
  }


  getOrdersList(page: number, size: number, sortBy: string, sortDirection: string, search: string = "", selectedFilter: string = "") {
    let searchText = "";
    let filterBy = ""
    if (search !== "") {
      searchText = `&search=${search}`;
    }
    if (selectedFilter !== "") {
      filterBy = `&filterBy=${selectedFilter}`;
    }
    const apiuri = `http://${this.serverIp}/api/order/table-details?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}${searchText}${filterBy}`
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData;
  }


  getOrderById(id: string) {
    const apiuri = `http://${this.serverIp}/api/order/${id}`;
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData
  }

  updateOrderStatusById(id: string, status: string) {
    const apiuri = `http://${this.serverIp}/api/order/status/${id}?status=${status}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const returnData: Observable<Object> = this.http.put(apiuri, { headers });
    return returnData;
  }

  //------------------------------------------------------

  getSuppliers(search: string) {
    const apiuri = `http://${this.serverIp}/api/supplier/search?search=${search}`;
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData;

  }
  //------------------------------------

  postNewPurchase(purchase: any) {
    const apiuri = `http://${this.serverIp}/api/purchase`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const returnData: Observable<Object> = this.http.post(apiuri, purchase, { headers });
    return returnData;
  }

  getPurchaseById(id: string) {
    const apiuri = `http://${this.serverIp}/api/purchase/get-purchase/${id}`;
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData
  }

  getPurchaseDetailById(id: string) {
    const apiuri = `http://${this.serverIp}/api/purchase/${id}`;
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData
  }

  getPurchasesList(page: number, size: number, sortBy: string, sortDirection: string, search: string = "") {
    let searchText = "";
    if (search !== "") {
      searchText = `&search=${search}`;
    }
    const apiuri = `http://${this.serverIp}/api/purchase/table-details?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}${searchText}`
    console.log(apiuri)
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData;
  }

  updatePurchaseStatusById(id: string, status: string) {
    const apiuri = `http://${this.serverIp}/api/purchase/status/${id}?status=${status}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const returnData: Observable<Object> = this.http.put(apiuri, { headers });
    return returnData;
  }

  //----------------------------------------------
  getDamageReports(page: number, size: number, sortBy: string, sortDirection: string, search: string = "", filter = "") {
    let searchText = "";
    let filterBy = "";
    if (search !== "") {
      searchText = `&search=${search}`;
    }
    if (filter !== "" ) {
      filterBy = `&filterBy=${filter}`;
    }
    const apiuri = `http://${this.serverIp}/api/damage-report/table-details?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}${searchText}${filterBy}`
    console.log(apiuri)
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData;
  }

  getDamageReportById(id: string) {
    const apiuri = `http://${this.serverIp}/api/damage-report/${id}`;
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData
  }
  
  getDamageStatusById(id: string) {
    const apiuri = `http://${this.serverIp}/api/damage-report/get-status/${id}`;
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData
  }


  approveDamageReport(id: string) {
    const apiuri = `http://${this.serverIp}/api/damage-report/approve/${id}`
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const returnData: Observable<Object> = this.http.put(apiuri, {headers});
    return returnData
  }

  rejectDamageReport(id: string) {
    const apiuri = `http://${this.serverIp}/api/damage-report/reject/${id}`
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const returnData: Observable<Object> = this.http.put(apiuri, {headers});
    return returnData
  }

  //--------------------------------------------------------
  getOverviewMetrics() {
    const apiuri = `http://${this.serverIp}/api/dashboard/overview-metrics`;
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData
  }

  getDamageMetrics() {
    const apiuri = `http://${this.serverIp}/api/dashboard/damage-metrics`;
    const returnData: Observable<Object> = this.http.get(apiuri);
    return returnData
  }






}


