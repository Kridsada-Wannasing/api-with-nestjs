import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import Subscriber from './subscribers.service';

interface SubscribersService {
  addSubscriber(subscriber: CreateSubscriberDto): Promise<Subscriber>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  getAllSubscribers(params: {}): Promise<{ data: Subscriber[] }>;
}

export default SubscribersService;
