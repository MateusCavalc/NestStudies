import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@/users/infrastructure/users.service';
import { UsersModule } from '@/users/infrastructure/users.module';
import { faker } from '@faker-js/faker';
import { UserEntity, UserProps } from '../../user.entity';

describe('UserEntity unit tests', () => {
    // let service: UsersService;
    let props: UserProps;
    let entity: UserEntity;

    beforeEach(() => {
        props = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }

        entity = new UserEntity(props);
    });

    // beforeEach(async () => {
    //     const module: TestingModule = await Test.createTestingModule({
    //         imports: [UsersModule],
    //         providers: [UsersService],
    //     }).compile();

    //     service = module.get<UsersService>(UsersService);
    // });

    // it('should be defined', () => {
    //     expect(service).toBeDefined();
    // });

    it('User Entity constructor method', () => {
        expect(entity.props.name).toBe(props.name);
        expect(entity.props.email).toBe(props.email);
        expect(entity.props.password).toBe(props.password);
        expect(entity.props.createdAt).toBeInstanceOf(Date);
    });
});
