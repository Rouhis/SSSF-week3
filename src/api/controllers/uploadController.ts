// TODO: create a controller to send the data of uploaded cat
// to the client
// data to send is described in UploadMessageResponse interface
//name catPost
import {Request, Response} from 'express';
import {Point} from 'geojson';
import UploadMessageResponse from '../../interfaces/UploadMessageResponse';

const catPost = (request: Request, response: Response) => {
  const data: UploadMessageResponse = {
    message: 'cat uploaded',
    data: {
      filename: request.body.filename,
      location: request.body.location as Point,
    },
  };
  response.json(data);
};

export {catPost};
