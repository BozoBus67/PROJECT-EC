import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Auction_House_Screen } from '../auction_house';
import { Login_Screen, Sign_Up_Screen } from '../auth';
import { Main_Screen } from '../game';
import { Mastery_Scrolls_Screen } from '../mastery_scrolls';
import { Redeem_Tokens_Screen } from '../redeem';
import { Buy_Premium_Screen, Login_Details_Screen, Settings_Screen } from '../settings';
import { Loading_Screen } from '../shared/components';

// Lazy-load chess: chess.js + react-chessboard + the stockfish wrapper add
// ~150 KB to the initial bundle. Most users open the game without ever
// playing chess, so we fetch the chess chunk on demand.
const Chess_Screen = lazy(() => import('../chess/chess_screen'));
const Chess_Game_Screen = lazy(() => import('../chess/chess_game_screen'));

// Single shell mounted by App.jsx after bootstrap. /game/* is always
// reachable (anonymous Supabase users let guests play without an account);
// /login + /signup are accessible to everyone via the top-bar Log In button.
//
// If bootstrap couldn't establish even an anonymous session, is_logged_in
// is false and we render the auth screens as the only available routes —
// covers the "anonymous sign-in is disabled in Supabase" failure mode.
export default function Main_Shell() {
  const is_logged_in = useSelector(state => state.session.is_logged_in);
  if (!is_logged_in) return <No_Session_Shell />;
  return (
    <Suspense fallback={<Loading_Screen />}>
      <Routes>
        <Route path="/login" element={<Login_Screen />} />
        <Route path="/signup" element={<Sign_Up_Screen />} />
        <Route path="/game" element={<Main_Screen />} />
        <Route path="/game/settings" element={<Settings_Screen />} />
        <Route path="/game/settings/login-details" element={<Login_Details_Screen />} />
        <Route path="/game/buy-premium" element={<Buy_Premium_Screen />} />
        <Route path="/game/auction-house" element={<Auction_House_Screen />} />
        <Route path="/game/mastery-scrolls" element={<Mastery_Scrolls_Screen />} />
        <Route path="/game/redeem-tokens" element={<Redeem_Tokens_Screen />} />
        <Route path="/game/play-chess" element={<Chess_Screen />} />
        <Route path="/game/play-chess/:bot_id" element={<Chess_Game_Screen />} />
        <Route path="*" element={<Navigate to="/game" replace />} />
      </Routes>
    </Suspense>
  );
}

function No_Session_Shell() {
  return (
    <Routes>
      <Route path="/login" element={<Login_Screen />} />
      <Route path="/signup" element={<Sign_Up_Screen />} />
      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
}
