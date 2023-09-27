import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@/users/infrastructure/users.service';
import { UsersModule } from '@/users/infrastructure/users.module';
import { UserDataBuilder } from '../helpers/user-data-builder';
import { UserEntity, UserProps } from '../../user.entity';

describe('UserEntity unit tests', () => {
    let service: UsersService;
    let props: UserProps;
    let entity: UserEntity;

    beforeEach(() => {
        props = UserDataBuilder({});

        entity = new UserEntity(props);
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [UsersModule],
            providers: [UsersService],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('User Entity constructor method', () => {
        expect(entity.props.name).toEqual(props.name);
        expect(entity.props.email).toEqual(props.email);
        expect(entity.props.password).toEqual(props.password);
        expect(entity.props.createdAt).toBeInstanceOf(Date);
    });

    it('id field Getter', () => {
        expect(entity.id).toBeDefined();
        expect(typeof entity.id).toBe('string');
    });

    it('name field Getter', () => {
        expect(entity.props.name).toBeDefined();
        expect(entity.props.name).toEqual(entity.name);
        expect(typeof entity.props.name).toBe('string');
    });

    it('email field Getter', () => {
        expect(entity.props.email).toBeDefined();
        expect(entity.props.email).toEqual(entity.email);
        expect(typeof entity.props.email).toBe('string');
    });

    it('password field Getter', () => {
        expect(entity.props.password).toBeDefined();
        expect(entity.props.password).toEqual(entity.password);
        expect(typeof entity.props.password).toBe('string');
    });

    it('createdAt field Getter', () => {
        expect(entity.props.createdAt).toBeDefined();
        expect(entity.props.createdAt).toBeInstanceOf(Date);
    });
});
