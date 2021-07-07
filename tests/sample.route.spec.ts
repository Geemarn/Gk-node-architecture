import mongoose from 'mongoose';
import config from 'config';
import supertest from 'supertest';
import {testServer} from '../src/app';
import Sample from '../src/version1/rest/sample/sample.model';

describe('API ROUTE: sample routes', () => {
  it('CREATE: `/v1/samples`', async () => {
    const sample = new Sample({ name: 'Joe' });
    await sample.save()
      .then(() => {
        // Has joe been saved successfully?
        expect(sample.isNew).toBe(true);
      });
    console.log(sample);
    await supertest(testServer)
      .get(`v1/samples`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
      });
  });
});
