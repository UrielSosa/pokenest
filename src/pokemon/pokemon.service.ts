import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){ }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    
    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;
    } catch(e) {
      this.handleExceptions(e);
    }
    
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, ofset = 0} = paginationDto;

    return await this.pokemonModel.find()
      .limit(limit)
      .skip(ofset)
      .sort({
        no: 1
      })
      .select('-__v')
  }

  async findOne(term: string) {
    let pokemon:Pokemon;

    /* Si es numero lo buscamos por "no" */
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({no: term});
    }
    
    /* Si es un mongoid lo buscamos por id */
    if (!pokemon && isValidObjectId( term )) {
        pokemon = await this.pokemonModel.findById( term );
    }
    
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase().trim()})
    }

    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or no ${term} not found`);
    
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if(updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    
    try {
      await pokemon.updateOne( updatePokemonDto );
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch(e) {
      this.handleExceptions(e);
    }


  }

  async remove(id: string) {
    // const pokemon = await this.findOne( id );
    // await pokemon.deleteOne();
    const { deletedCount } = await this.pokemonModel.deleteOne( { _id: id } );
    
    if( deletedCount === 0 ) throw new BadRequestException(`Pokemon with id ${id} not found`);

    return;
  }
  
  async createMany (createPokemonDto: CreatePokemonDto[]) {
    createPokemonDto.forEach(poke => {
      poke.name = poke.name.toLowerCase();
    });
    
    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;
    } catch(e) {
      this.handleExceptions(e);
    }
  }
  
  private handleExceptions (e: any) {
    if(e.code === 11000) {
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(e.keyValue)}`);
    }
    console.log(e);
    throw new InternalServerErrorException(`Cannot create pokemon, check the logs`)
  }
}
