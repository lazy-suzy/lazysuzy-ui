import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs'; // RxJS 6 syntax
import {HttpHeaders} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {environment as env} from 'src/environments/environment';
import {HttpService} from '../http/http.service';
import {UtilsService} from '../utils/utils.service';
import {IDepartment, IProductDetail, IProductPayload, IProductsPayload, ISearchProductsPayload} from './../../models';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(
        private httpService: HttpService,
        private cookie: CookieService,
        private utils: UtilsService
    ) {
    }

    getNewArrivals(filters = '', page = 0): Observable<IProductsPayload> {
        const endpoint = `products/all`;
        const url = env.useLocalJson
            ? `${env.JSON_BASE_HREF}${endpoint}`
            : `${env.API_BASE_HREF}${endpoint}?new=true`;
        return this.httpService.get(url);
    }

    getTopDeals(filters = '', page = 0): Observable<IProductsPayload> {
        const endpoint = `products/all`;
        const url = env.useLocalJson
            ? `${env.JSON_BASE_HREF}${endpoint}`
            : `${env.API_BASE_HREF}${endpoint}?sale=true`;
        return this.httpService.get(url);
    }

    getBlowOutDeals() {
        const dealEndpoint = `v1/blowout-deals`;
        const url = env.useLocalJson
            ? `${env.JSON_BASE_HREF}${dealEndpoint}`
            : `${env.API_BASE_HREF}${dealEndpoint}`;
        return this.httpService.get(url);
    }

    getTrendingProducts(): Observable<IProductsPayload> {
        const endPoint = `trending`;
        const url = `${env.API_BASE_HREF}${endPoint}`;
        return this.httpService.get(url);
    }

    getBestSellers(filters = '', page = 0): Observable<IProductsPayload> {
        const endpoint = `products/all`;
        const url = env.useLocalJson
            ? `${env.JSON_BASE_HREF}${endpoint}`
            : `${env.API_BASE_HREF}${endpoint}?bestseller=true`;
        return this.httpService.get(url);
    }

    getEmail(email = '', url = '') {
        const endpoint = 'subscribe';
        const path = env.useLocalJson
            ? `${env.JSON_BASE_HREF}${endpoint}`
            : `${env.API_BASE_HREF}${endpoint}?email=${email}&url=${url}`;
        return this.httpService.get(path);
    }

    getBrands(): Observable<IProductPayload> {
        const url = env.useLocalJson
            ? `${env.JSON_BASE_HREF}brand`
            : `${env.API_BASE_HREF}brand`;
        return this.httpService.get(url);
    }

    browseRoom() {
        const endpoint = 'all-departments';
        const url = env.useLocalJson
            ? `${env.JSON_BASE_HREF}${endpoint}`
            : `${env.API_BASE_HREF}${endpoint}?home=true`;
        return this.httpService.get(url);
    }

    bannerData() {
        const endpoint = 'banners';
        const url = env.useLocalJson
            ? `${env.JSON_BASE_HREF}${endpoint}`
            : `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.get(url);
    }

    getAllProducts(
        trend: string,
        total: number,
        filters = '',
        sortType = '',
        page = 0
    ): Observable<IProductsPayload> {
        const endpoint = `products/all`;
        const url = env.useLocalJson
            ? `${env.JSON_BASE_HREF}${endpoint}`
            : `${env.API_BASE_HREF}${endpoint}?${trend}=true&limit=${total}&filters=${filters}&sort_type=${sortType}&pageno=${page}`;
        return this.httpService.get(url);
    }

    getMultiplePageAllProducts(
        trend: string,
        total: number,
        filters = '',
        sortType = '',
        page: number
    ): Observable<any> {
        const httpCalls = [];
        const endpoint = `products/all`;
        for (let i = 0; i <= page; i++) {
            const url = env.useLocalJson
                ? `${env.JSON_BASE_HREF}${endpoint}`
                : `${env.API_BASE_HREF}${endpoint}?${trend}=true&limit=${total}&filters=${filters}&sort_type=${sortType}&pageno=${i}`;
            httpCalls.push(this.httpService.get(url));
        }
        return forkJoin(httpCalls);
    }

    getProducts(
        department: string,
        category: string,
        filters = '',
        sortType = '',
        page = 0
    ): Observable<IProductsPayload> {
        const endpoint = `products/${department}/${category}`;
        const url = env.useLocalJson
            ? `${env.JSON_BASE_HREF}${endpoint}`
            : `${env.API_BASE_HREF}${endpoint}?filters=${filters}&sort_type=${sortType}&pageno=${page}`;
        return this.httpService.get(url);
    }

    getBrandData(brandName: string): Observable<any> {
        let endpoint = `brand`;
        if (brandName !== '') {
            endpoint = `brand/${brandName}`;
        }
        const url = env.useLocalJson
            ? `${env.JSON_BASE_HREF}${endpoint}`
            : `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.get(url);
    }

    getMultiplePageProducts(
        department: string,
        category: string,
        filters = '',
        sortType = '',
        page: number
    ): Observable<any> {
        const httpCalls = [];
        const endpoint = `products/${department}/${category}`;
        for (let i = 0; i <= page; i++) {
            const url = env.useLocalJson
                ? `${env.JSON_BASE_HREF}${endpoint}`
                : `${env.API_BASE_HREF}${endpoint}?filters=${filters}&sort_type=${sortType}&pageno=${i}`;
            httpCalls.push(this.httpService.get(url));
        }
        return forkJoin(httpCalls);
    }

    getProduct(id: string): Observable<IProductDetail> {
        const endpoint = `product/${id}`;
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.get(url);
    }

    getAllBrandNames(): Observable<any> {
        const endpoint = `brand`;
        const url = env.useLocalJson
            ? `${env.JSON_BASE_HREF}${endpoint}`
            : `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.get(url);
    }

    getAllDepartments(brandFilter: string = ''): Observable<IDepartment> {
        let endpoint = `all-departments`;
        if (brandFilter !== '' && brandFilter !== undefined) {
            endpoint = `all-departments?brands=${brandFilter}`;
        }
        const url = env.useLocalJson
            ? `${env.JSON_BASE_HREF}${endpoint}`
            : `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.get(url);
    }

    getBrowseTabData(
        id: string,
        appliedFilters: string,
        pageNo
    ): Observable<any> {
        const endpoint = `products/all`;
        const url = env.useLocalJson
            ? `${env.JSON_BASE_HREF}${endpoint}`
            : `${
                env.API_BASE_HREF
            }${endpoint}?filters=${appliedFilters};category:${id}&sort_type=&pageno=${
                pageNo || 0
            }&limit=24&board-view=true`;
        return this.httpService.get(url);
    }

    getSearchProducts(searchQuery: string): Observable<ISearchProductsPayload> {
        const endpoint = `products/_search`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        const url = `${env.ES_API_BASE_HREF}${endpoint}?source=${searchQuery}&source_content_type=application%2Fjson`;
        return this.httpService.get(url, headers);
    }

    getWishlistProducts(isBoard): Observable<IProductsPayload> {
        // const filters = '';
        // const sortTypes = '';
        // const endpoint = `products/${department}/${category}`;
        const endpoint = `wishlist`;
        const url = `${env.API_BASE_HREF}${endpoint}${
            isBoard ? '?board-view=true' : ''
        }`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.cookie.get('token')}`
        });
        // env.useLocalJson
        //   ? `${env.JSON_BASE_HREF}${endpoint}`
        //   : `${env.API_BASE_HREF}${endpoint}?filters=${filters}&sort_type=${sortTypes}&pageno=${page}`;
        return this.httpService.get(url, headers);
    }

    getCategories(department: string): Observable<ISearchProductsPayload> {
        const endpoint = `categories/${department}`;
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.get(url);
    }

    login(data) {
        const endpoint = `login`;
        const url = `${env.API_BASE_HREF}${endpoint}`;
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.cookie.get('token')}`
        });
        return this.httpService.post(url, data, headers);
    }

    subscription(URL, email): Observable<string> {
        const endpoint = `subscribe`;
        const url = `${env.API_BASE_HREF}${endpoint}?url=${URL}&email=${email}`;
        return this.httpService.get(url);
    }

    wishlistProduct(sku, mark, isHandset: boolean) {
        let endpoint;
        if (mark) {
            endpoint = `mark/favourite/${sku}`;
        } else {
            endpoint = `unmark/favourite/${sku}`;
        }
        const token = this.cookie.get('token');
        if (!token) {
            // trigger signup window
            this.utils.openSignupDialog(isHandset, true);
            return;
        }
        const url = `${env.API_BASE_HREF}${endpoint}`;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        });
        return this.httpService.get(url, headers);
    }

    signup(data) {
        const endpoint = `register`;
        const url = `${env.API_BASE_HREF}${endpoint}`;
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.cookie.get('token')}`
        });
        return this.httpService.post(url, data, headers);
    }

    signout() {
        const endpoint = `logout`;
        const url = `${env.API_BASE_HREF}${endpoint}`;
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.cookie.get('token')}`
        });
        return this.httpService.get(url, headers);
    }

    keepAlive() {
        const endpoint = `user/keepalive`;
        const url = `${env.API_BASE_HREF}${endpoint}`;
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.cookie.get('token')}`
        });
        return this.httpService.get(url, headers);
    }

    getPosts(): Observable<any[]> {
        return this.httpService.get<any[]>(
            'https://psimonmyway.com/wp-json/wp/v2/posts?_embed',
            {
                params: {
                    per_page: '6'
                }
            }
        );
    }

    getPostById(id): Observable<any[]> {
        return this.httpService.get<any[]>(
            `https://psimonmyway.com/wp-json/wp/v2/posts/${id}`
        );
    }

    getAuthToken(accessToken, provider) {
        const endpoint = `oauth/token`;
        const url = `${env.API_BASE_HREF}${endpoint}`;
        const data = {
            access_token: accessToken,
            client_id: env.CLIENT_ID,
            client_secret: env.CLIENT_SECRET,
            grant_type: 'social',
            provider
        };
        return this.httpService.post(url, data);
    }

    addCartProduct(data) {
        const token = this.cookie.get('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        });
        const endpoint = 'cart/add';
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.post(url, data, headers);
    }

    removeCartProduct(data) {
        const token = this.cookie.get('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        });
        const endpoint = 'cart/remove';
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.post(url, data, headers);
    }

    getCartProduct(hasState, state, hasPromo?, promoCode?) {
        let endpoint = hasState ? `cart?state_code=${state}` : 'cart';
        endpoint = hasPromo ? `${endpoint}&promo=${promoCode}` : endpoint;
        const token = this.cookie.get('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        });
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.get(url, headers);
    }

    getAllDepartmentsBoard(): Observable<IDepartment> {
        const endpoint = `all-departments`;
        const url = env.useLocalJson
            ? `${env.JSON_BASE_HREF}${endpoint}`
            : `${env.API_BASE_HREF}${endpoint}?board-view=true`;
        return this.httpService.get(url);
    }

    getAllBoards(payload): Observable<IProductPayload> {
        const url = `${env.API_BASE_HREF}board`;
        return this.httpService.post(url, {
            operation: 'select',
            entity: 'board',
            data: 5,
            Buser_id: 1
        });
    }

    postStripeToken(data) {
        const token = this.cookie.get('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        });
        const endpoint = `payment/charge`;
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.post(url, data, headers);
    }

    getOrderSuccessData(orderId) {
        const token = this.cookie.get('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        });
        const endpoint = `order?order_id=${orderId}`;
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.get(url, headers);
    }

    userUpdate(data) {
        const token = this.cookie.get('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        });
        const endpoint = `user/update`;
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.post(url, data, headers);
    }

    sendPasswordResetLink(data) {
        const endpoint = `password/create`;
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.post(url, data);
    }

    validateResetPasswordToken(token) {
        const endpoint = `password/find/${token}`;
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.get(url);
    }

    setNewPassword(data) {
        const endpoint = `password/reset`;
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.post(url, data);
    }

    updateProfile(data) {
        const endpoint = 'user/details/update';
        const token = this.cookie.get('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.post(url, data, headers);
    }

    getProfile() {
        const endpoint = 'get-user';
        const token = this.cookie.get('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.get(url, headers);
    }

    fetchDisplayProfile(username) {
        const endpoint = `user/details?username=${username}`;
        const token = this.cookie.get('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.get(url, headers);
    }

    getUserBoards(username) {
        const endpoint = `board?username=${username}`;
        const token = this.cookie.get('token');
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.get(url);
    }

    likeBoard(boardId, like) {
        const apiAction = like ? 'like' : 'unlike';
        const endpoint = `board/${apiAction}/${boardId}`;
        const token = this.cookie.get('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.post(url, headers);
    }

    getCollections() {
        const url = `${env.API_BASE_HREF}collections`;
        return this.httpService.get(url);
    }

    getCollectionData(collection) {
        const url = `${env.API_BASE_HREF}collection?collection=${collection}`;
        return this.httpService.get(url);
    }

    getDeals() {
        const url = `${env.API_BASE_HREF}deals`;
        return this.httpService.get(url);
    }

    getRecentProducts() {
        const recentProductsUrl = `sku-history`;
        const token = this.cookie.get('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        const url = `${env.API_BASE_HREF}${recentProductsUrl}`;
        return this.httpService.get(url, headers);
    }

    submitReview(data) {
        const endpoint = 'review';
        const token = this.cookie.get('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.post(url, data, headers);
    }


    getProductReviews(id: string, limit) {
        // const limit = 6;
        const endpoint = `review/getreview-${id}/${limit}`;
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.get(url);
    }

    // Mark Review Helpful
    markReviewHelpful(userId: number, reviewId: number) {
        const data = {
            user_id: userId,
            review_id: reviewId
        };
        const endpoint = `mark-helpful`;
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.post(url, data);
    }

    // Report Review
    reportReview(userId: number, reviewId: number) {
        const data = {
            user_id: userId,
            review_id: reviewId
        };
        const endpoint = `mark-reported`;
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.post(url, data);
    }

    // Get Full Review List
    getFullReviewList(sku, pageNo, sortType: string = '') {
        const endpoint = sortType ?
            `allreviews/${sku}?sort_type=${sortType}&pageno=${pageNo}` :
            `allreviews/${sku}?pageno=${pageNo}`;
        const url = `${env.API_BASE_HREF}${endpoint}`;
        return this.httpService.get(url);
    }

    // getOtherPeopleProducts()
    getOtherPeopleProducts(sku) {
        const endPoint = `other-views/userrelated-${sku}`;
        const url = `${env.API_BASE_HREF}${endPoint}`;
        return this.httpService.get(url);
    }

    // Api to get Order Details
    getOrderDetails(orderNumber, zipCode) {
        const endPoint = orderNumber && zipCode ?
            `order_status?orderid=${orderNumber}&zipcode=${zipCode}` :
            `order_status`;
        const url = `${env.API_BASE_HREF}${endPoint}`;
        return this.httpService.get(url);
    }

    saveCheckoutEmail(emailId = '') {
        if (emailId) {
            const endpoint = 'save_checkout';
            const token = this.cookie.get('token');
            const headers = new HttpHeaders({
                Authorization: `Bearer ${token}`
            });
            const data = {
                emailid: emailId
            };
            const url = `${env.API_BASE_HREF}${endpoint}`;
            return this.httpService.post(url, data, headers);
        }
    }

    getCollectionsCount() {
        const endPoint = 'get_all_collection';
        const url = `${env.API_BASE_HREF}${endPoint}`;
        return this.httpService.get(url);
    }
}
