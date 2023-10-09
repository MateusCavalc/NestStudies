import { faker } from '@faker-js/faker';
import { UserProps } from '../../user.entity';

type FakeProps = {
    name?: string
    email?: string
    password?: string
    createdAt?: Date
}

export async function UserDataBuilder(props: FakeProps): Promise<UserProps> {
    await sleep(100);

    return {
        name: props.name ?? faker.person.fullName(),
        email: props.email ?? faker.internet.email(),
        password: props.password ?? faker.internet.password(),
        createdAt: props.createdAt ?? new Date(),
    }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));