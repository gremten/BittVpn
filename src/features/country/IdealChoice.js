import { Block } from '../../components/ui';
import workIcon from '../../assets/icons/work.svg';
import gamesIcon from '../../assets/icons/games.svg';
import educationIcon from '../../assets/icons/education.svg';
import paymentsIcon from '../../assets/icons/payments.svg';

const ITEMS = [
  { icon: workIcon, title: 'Работа', description: 'Сервисы для работы и общения' },
  { icon: gamesIcon, title: 'Игры', description: 'Матчи без задержек' },
  { icon: educationIcon, title: 'Образование', description: 'Курсы и учебные материалы' },
  { icon: paymentsIcon, title: 'Платежи', description: 'Банки, переводы и покупки' },
];

export default function IdealChoice() {
  return (
    <section className="section-block">
      <h2 className="section-title">/идеальный выбор</h2>
      <Block className="ideal-card surface-card">
        {ITEMS.map((item, index) => (
          <div className="ideal-row" key={item.title}>
            <img className="ideal-icon" src={item.icon} alt="" aria-hidden="true" />
            <div className={`ideal-copy ${index < ITEMS.length - 1 ? 'ideal-copy--divided' : ''}`}>
              <div className="body-medium">{item.title}</div>
              <div className="caption">{item.description}</div>
            </div>
          </div>
        ))}
      </Block>
    </section>
  );
}
