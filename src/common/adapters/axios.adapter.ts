import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from '../interfaces/http-adapter.interface';

export class AxiosAdapter implements HttpAdapter {
    
    private readonly axios: AxiosInstance = axios;

    async get<T>(url: string): Promise<T> {
        try {
            const { data } = await this.axios.get<T>( url );
            return data;
        } catch (e) {
            throw new Error(`Error ${e}`);
        }
    }

}