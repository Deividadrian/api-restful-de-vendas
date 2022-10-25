import { Request, Response } from 'express';
import CreateUserService from '../services/CreateUserService';
import DeleteUserService from '../services/DeleteUserService';
import ListUserService from '../services/ListUserService';
import ShowUserService from '../services/ShowUserService';
import UpdateUserService from '../services/UpdateUserService';


export default class UsersController {
    public async create(request: Request, response: Response): Promise<Response> {
      const {name, email, password} = request.body;

      const createUser = new CreateUserService();

      const users = await createUser.execute({name, email, password});

      return response.json(users);
    }

    public async index(request: Request, response: Response): Promise<Response> {
      const listUser = new ListUserService();

      const users = await listUser.execute();

      return response.json(users);
    }

    public async delete(request: Request, response: Response): Promise<Response> {
      const {id} = request.params;

      const deleteUser = new DeleteUserService();

      await deleteUser.execute({ id });

      return response.json([]);
    }

    public async update(request: Request, response: Response): Promise<Response> {
      const { name, email, password, avatar } = request.body;
      const { id } = request.params;

      const updateUser =  new UpdateUserService();

      const user = await updateUser.execute({ id, name, email, password, avatar })

      return response.json(user);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showUser= new ShowUserService();

    const user = await showUser.execute({ id });

    return response.json(user);
  }
  }
