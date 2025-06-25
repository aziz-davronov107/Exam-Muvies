import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from '@redis/client';


@Injectable()
export class RedisService {
    constructor(@Inject('REDIS_CLIENT') private client: RedisClientType){}

    async set(key:string,value:any,ttl = 60){
        await this.client.set(key,JSON.stringify(value),{EX:ttl});
    }

    async get<T=any>(key:string):Promise<T | null>{
        let data = await this.client.get(key);
        return data ? JSON.parse(data) : null
    }

    async del(key:string){
        await this.client.del(key)
    }

    async exists(key:string){
        const result = await this.client.exists(key);
        return result==1 ? true : false
    }
}
