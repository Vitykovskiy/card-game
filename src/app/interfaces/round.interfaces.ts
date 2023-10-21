import { GameStatus, PlayerStatus } from './game.interfaces';

enum RoundDataTypes {
  ResultData = 'result',
  StartData = 'start',
  SelectedCardsData = 'selected-cards',
}

interface IResultRoundData {
  who_chose_youc_cards: number[];
  points_for_round: number;
  all_points: number;
  guess_right: boolean;
}

interface IStartRoundData {
  game_status: GameStatus;
  leader_id: number;
  player_cards: { [key: string]: string };
  players: { [key: string]: IPlayer };
}

interface IPlayer {
  id?: string;
  avatar: string;
  status: PlayerStatus;
  points: number;
}

interface ISelectedCards {
  your_card: number;
  placeCards: { [key: string]: string };
}

interface ICard {
  id: string;
  url: string;
}

interface IChoice {
  choice: number;
}

function isResultRoundData(data: any): boolean {
  return (
    'who_chose_you_cards' in data &&
    'points_for_round' in data &&
    'all_points' in data &&
    'guess_right' in data
  );
}

function isStartRoundData(data: any): boolean {
  return (
    'game_status' in data &&
    'leader_id' in data &&
    'player_cards' in data &&
    'players' in data
  );
}

function IsSelectedCardsData(data: any): boolean {
  return 'your_card' in data && 'placeCards' in data;
}

function checkRoundDataType(data: any): RoundDataTypes | null {
  if (isStartRoundData(data)) {
    console.log('isStartRoundData');
    return RoundDataTypes.StartData;
  }
  if (isResultRoundData(data)) {
    console.log('isResultRoundData');
    return RoundDataTypes.ResultData;
  }

  if (IsSelectedCardsData(data)) {
    console.log('IsSelectedCardsData');
    return RoundDataTypes.SelectedCardsData;
  }
  return null;
}

export function transformCardsObjectToArray(
  data: {
    [key: string]: string;
  } | null,
): ICard[] {
  if (!data) {
    return [];
  }
  const cardsIds = Object.keys(data);
  const cardsUrls = Object.values(data);
  return cardsUrls.map((url, index) => {
    return { id: cardsIds[index], url: url };
  });
}

export function transformPlayersObjectToArray(
  data: {
    [key: string]: string;
  } | null,
): any[] {
  if (!data) {
    return [];
  }
  const cardsIds = Object.keys(data);
  const cardsUrls = Object.values(data);
  return cardsUrls.map((url, index) => {
    return { id: cardsIds[index], url: url };
  });
}

export {
  RoundDataTypes,
  IResultRoundData,
  IStartRoundData,
  IChoice,
  IPlayer,
  ISelectedCards,
  ICard,
  checkRoundDataType,
};
