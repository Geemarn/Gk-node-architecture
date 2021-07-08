import faker from 'faker';
import Member from '../v1/rest/member/member.model';
import Employee from '../v1/rest/member/profiles/employee.model';
import Contractor from '../v1/rest/member/profiles/contractor.model';
import {
  getRandomArbitrary,
  getRandomSubarray,
  randomDate,
} from '../utils/helpers';

/**
 * Seed data
 * @param {Number} size of data to seed
 * @return {Number} seeded data
 */
export default async (size = 10) => {
  const tags = [
    'java',
    'php',
    'react',
    'angular',
    'c#',
    'Vb',
    'vue',
    'laravel',
    'cakePHP',
    'nestjs',
    'nodejs',
    'golang',
  ];

  const type = ['Employee', 'Contractor'];

  const roles = [
    'Software Engineer',
    'Data Scientist',
    'Network Admin',
    'DevOps Engineer',
    'Project Manager',
  ];

  const members = [];
  for (let i = 0; i < size; i++) {
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let email = faker.internet.email();
    let tagSet = getRandomSubarray(tags, getRandomArbitrary(0, tags.length));

    const randomInt = getRandomArbitrary(0, 1);
    const profileType = type[randomInt];

    const ProfileModel = profileType === 'Contractor' ? Contractor : Employee;
    let member = new Member({
      firstName,
      lastName,
      email,
      tags: tagSet,
      profileType,
    });

    let profilePayload = {
      role: roles[getRandomArbitrary(0, roles.length)],
    };
    if (profileType === 'Contractor') {
      profilePayload = {
        startDate: randomDate(new Date(2020, 0, 1), new Date(2021, 11, 1)),
        endDate: randomDate(new Date(2021, 0, 1), new Date(2021, 11, 1)),
      };
    }
    const profile = await ProfileModel.findOneAndUpdate(
      { member: member._id },
      {
        ...profilePayload,
        $setOnInsert: {
          member: member._id,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    member.profile = profile._id;
    member = await member.save();
    members.push(member);
  }
  return members.length;
};
