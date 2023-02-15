import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';

import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { CreatePokemonDto } from '../pokemon/dto/create-pokemon.dto';

@Injectable()
export class SeedService {
  
  private readonly axios: AxiosInstance = axios;
  
  constructor (
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async executeSeed() {
    
    await this.pokemonModel.deleteMany({});

    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=700');

    const pokemons:CreatePokemonDto[] = data.results.map(({name, url}) => {
      const segments = url.split('/');
      const no:number = +segments[ segments.length -2 ];
      return { name, no };
    });


    await this.pokemonModel.insertMany(pokemons);

    return 'seed executed';
  }

}
