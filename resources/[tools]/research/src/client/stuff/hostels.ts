// sLocal_302 = "Script_Mini_Game_Bathing_Regular"; _REQUEST_MOVE_NETWORK_DEF
// sLocal_303 = "Script_Mini_Game_Bathing_Deluxe";  _REQUEST_MOVE_NETWORK_DEF
// sLocal_304 = "MINI_GAMES@BATHING@REGULAR@ARTHUR"; REQUEST_ANIM_DICT
// sLocal_305 = "CLIPSET@MINI_GAMES@BATHING@REGULAR@ARTHUR"; REQUEST_CLIP_SET
// sLocal_306 = "MINI_GAMES@BATHING@REGULAR@RAG"; REQUEST_ANIM_DICT
// sLocal_307 = "CLIPSET@MINI_GAMES@BATHING@REGULAR@RAG"; REQUEST_CLIP_SET
// sLocal_308 = "MINI_GAMES@BATHING@DELUXE@ARTHUR"; REQUEST_ANIM_DICT
// sLocal_309 = "CLIPSET@MINI_GAMES@BATHING@DELUXE@ARTHUR";REQUEST_CLIP_SET
// sLocal_310 = "MINI_GAMES@BATHING@DELUXE@MAID"; REQUEST_ANIM_DICT
// sLocal_311 = "CLIPSET@MINI_GAMES@BATHING@DELUXE@MAID"; REQUEST_CLIP_SET
// iLocal_312 = joaat("P_GEN_BOOTS02");
// iLocal_313 = joaat("P_BLANKETFOLDED01X");
// iLocal_314 = joaat("P_CS_RAG02X");

// The above are requested on line 750

//	iParam0->f_7 = { 2638.085f, -1222.06f, 52.3805f };
// 	iParam0->f_10 = { 2629.204f, -1222.544f, 58.79413f };
// 	iParam0->f_57 = { 2629.204f, -1222.544f, 58.79413f };
// 	iParam0->f_60 = { 2629.4f, -1223.33f, 58.57f };

// 	iParam0->f_135.f_1 = { 2630.003f, -1220.47f, 58.5874f }; // Saint denis bath

//iParam0->f_120[6] = GRAPHICS::START_PARTICLE_FX_LOOPED_AT_COORD("scr_mg_bathing_tub_steam", iParam0->f_60, 90f, 0f, 0f, 1f, false, false, false, false);

/// Line are the animations 3446

//s_Regular_outro
//s_regular_intro
// bath_orbit_cam

//AUDIO::TRIGGER_MUSIC_EVENT("MG_BATHING_START");
//TASK::IS_TASK_MOVE_NETWORK_READY_FOR_TRANSITION(PLAYERPEDID))

// VALENTINE COORDS
// -325.5526f, 772.9926f, 116.4359f Door man
// -316.5032f, 761.952f, 117.0856f Player Bath Coords
// -317.37f, 761.8f, 116.44f Particle Bath Coords
// iParam0->f_13 = VOLUME::_CREATE_VOLUME_BOX(-324.5964f, 774.3613f, 117.5638f, 0f, 0f, 10.75094f, 1.171861f, 1.219162f, 2.336554f);
// iParam0->f_14 = VOLUME::_CREATE_VOLUME_BOX(-319.7882f, 762.5787f, 117.8969f, 0f, 0f, 10.09051f, 3.165397f, 3.414144f, 3.011062f);

import { Delay } from '@lib/functions';
import { Vector3 } from '@lib/math';
import * as net from 'net';

let volume1 = -1;
let volume2 = -1;
let particles = -1;
let introAnimScene = -1;
let allParticles: number[] = [];

const CreateVolumes = () => {
  volume1 = CreateVolumeBox(-324.5964, 774.3613, 117.5638, 0.0, 0.0, 10.75094, 1.171861, 1.219162, 2.336554);
  volume2 = CreateVolumeBox(-319.7882, 762.5787, 117.8969, 0.0, 0.0, 10.09051, 3.165397, 3.414144, 3.011062);
};

RegisterCommand(
  'startParticles',
  () => {
    particles = StartParticleFxLoopedAtCoord(
      'scr_mg_bathing_tub_steam',
      -317.37,
      761.8,
      116.44,
      90.0,
      0.0,
      0.0,
      1.0,
      false,
      false,
      false,
      false,
    );
  },
  false,
);

const LoadAnimationDicts = async () => {
  RequestAnimDict('MINI_GAMES@BATHING@REGULAR@ARTHUR');
  while (!HasAnimDictLoaded('MINI_GAMES@BATHING@REGULAR@ARTHUR')) {
    console.log('loading', HasAnimDictLoaded('MINI_GAMES@BATHING@REGULAR@ARTHUR'));

    await Delay(5);
  }
  RequestMoveNetworkDef('Script_Mini_Game_Bathing_Regular');
  while (!HasMoveNetworkDefLoaded('Script_Mini_Game_Bathing_Regular')) {
    console.log('loadin def', HasMoveNetworkDefLoaded('Script_Mini_Game_Bathing_Regular'));

    await Delay(5);
  }
  RequestClipSet('CLIPSET@MINI_GAMES@BATHING@REGULAR@ARTHUR');
  while (!HasClipSetLoaded('CLIPSET@MINI_GAMES@BATHING@REGULAR@ARTHUR')) {
    console.log('loadin clipset', HasClipSetLoaded('CLIPSET@MINI_GAMES@BATHING@REGULAR@ARTHUR'));

    await Delay(5);
  }
  if (!PrepareSoundset('BATHING_Sounds', false)) {
    console.log('loadin soundset', PrepareSoundset('BATHING_Sounds', false));
  }
  // @ts-ignore
  while (!RequestScriptAudioBank('BATHING')) {
    // @ts-ignore
    console.log('loadin audio bank', RequestScriptAudioBank('BATHING'));

    await Delay(5);
  }
};
// { PlayerPedId(), "Script_Mini_Game_Bathing_Regular", `CLIPSET@MINI_GAMES@BATHING@REGULAR@ARTHUR`, `DEFAULT`, "BATHING" }

// taken from https://github.com/outsider31000/public-scripts/blob/97958b854309be3951e2d743a971624cbc3bd693/server-data/resources/%5Bothers%5D/redm_bathing/structs.js#L4
const TASK_MOVE_NETWORK_BY_NAME_WITH_INIT_PARAMS = (
  ped: number,
  networkdef: string,
  clipSet: number,
  p3: number,
  name: string,
) => {
  const struct = new DataView(new ArrayBuffer(512));
  struct.setBigInt64(0, BigInt(clipSet), true);
  struct.setBigInt64(8, BigInt(p3), true);
  struct.setBigInt64(240, BigInt(VarString(10, 'LITERAL_STRING', name)), true);

  Citizen.invokeNative('0x139805C2A67C4795', ped, networkdef, struct, 1.0, 0, 0, 0);
};

const SetScrubFreq = (freq: number) => {
  SetTaskMoveNetworkSignalFloat(PlayerPedId(), 'scrub_freq', freq);
};

//bath_orbit_cam αυτο εδω ειναι το dictionary
//BATH_ORBIT_REQUEST

let proxyIndex = -1;

const EnableArtificalLightsForThisInterior = () => {
  const playerCoords = new Vector3().setFromArray(GetEntityCoords(PlayerPedId()));
  const interiorId = GetInteriorAtCoords(playerCoords.x, playerCoords.y, playerCoords.z);
  if (!IsValidInterior(interiorId)) return;

  proxyIndex = Citizen.invokeNative('0x5D1C5D8E62E8EE1C', interiorId, Citizen.resultAsInteger()) as number;
  if (proxyIndex === 0) return;
  const artificialLightsEnabled = Citizen.invokeNative(
    '0x113857D66A9CABE6',
    proxyIndex,
    Citizen.resultAsInteger(),
  ) as number;

  if (artificialLightsEnabled === 0) {
    Citizen.invokeNative('0xBFCB17895BB99E4E', proxyIndex, true);
    PinInteriorInMemory(interiorId);
  }
};

RegisterCommand(
  'intro_animation',
  async () => {
    await LoadAnimationDicts();
    ReserveAmbientPeds(2);
    console.log('Starting music event');
    TriggerMusicEvent('MG_BATHING_START');
    console.log('Done loading animation dictionaries');
    introAnimScene = CreateAnimScene(
      'script@mini_game@bathing@BATHING_INTRO_OUTRO_VALENTINE',
      0,
      's_Regular_intro',
      false,
      true,
    );
    console.log('Created anim scene:', introAnimScene);
    SetAnimSceneEntity(introAnimScene, 'ARTHUR', PlayerPedId(), 0);
    // SetAnimSceneEntity(introAnimScene, 'john_Marston', PlayerPedId(), 0);
    LoadAnimScene(introAnimScene);
    await Delay(1000);
    StartAnimScene(introAnimScene);
    EnableArtificalLightsForThisInterior();
    CreateVolumes();
  },
  false,
);

RegisterCommand(
  'outro_animation',
  async () => {
    await LoadAnimationDicts();

    console.log('Stopping music event');
    console.log('Done loading animation dictionaries');
    TriggerMusicEvent('MG_BATHING_STOP');
    const animScene = CreateAnimScene(
      'script@mini_game@bathing@BATHING_INTRO_OUTRO_VALENTINE',
      0,
      's_Regular_outro',
      false,
      true,
    );
    console.log('Created anim scene:', animScene);
    SetAnimSceneEntity(animScene, 'ARTHUR', PlayerPedId(), 0);
    // SetAnimSceneEntity(animScene, 'john_Marston', PlayerPedId(), 0);
    LoadAnimScene(animScene);
    await Delay(1000);
    StartAnimScene(animScene);
    if (proxyIndex !== -1) {
      Citizen.invokeNative('0xBFCB17895BB99E4E', proxyIndex, false);
    }
    if (DoesVolumeExist(volume1)) {
      DeleteVolume(volume1);
    }
    if (DoesVolumeExist(volume2)) {
      DeleteVolume(volume2);
    }
  },
  false,
);

RegisterCommand(
  'inside_bath',
  async () => {
    ExecuteCommand('intro_animation');
    while (!IsAnimSceneFinished(introAnimScene, true)) {
      await Delay(5);
    }
    SetPedCanLegIk(PlayerPedId(), false);
    SetPedLegIkMode(PlayerPedId(), 0);
    // Citizen.invokeNative('0x69D65E89FFD72313', true, true);
    SetScrubFreq(0.0);
    TASK_MOVE_NETWORK_BY_NAME_WITH_INIT_PARAMS(
      PlayerPedId(),
      'Script_Mini_Game_Bathing_Regular',
      GetHashKey('CLIPSET@MINI_GAMES@BATHING@REGULAR@ARTHUR'),
      GetHashKey('DEFAULT'),
      'BATHING',
    );
    ForcePedAiAndAnimationUpdate(PlayerPedId(), false, false);
    Citizen.invokeNative('0x55546004A244302A', PlayerPedId());

    await Delay(5000);

    while (!IsTaskMoveNetworkReadyForTransition(PlayerPedId())) {
      console.log('Waiting for the clipset to be ready for network transitions');
      await Delay(5);
    }

    console.log('Ready for transitions');

    if (GetTaskMoveNetworkState(PlayerPedId()) !== 'Scrub_Idle') {
      RequestTaskMoveNetworkStateTransition(PlayerPedId(), 'Scrub_Idle');
      console.log('Should start to transition to scrub idle');
      await Delay(5000);
    }

    while (!IsTaskMoveNetworkReadyForTransition(PlayerPedId())) {
      console.log('Waiting for the clipset to be ready for network transitions');
      await Delay(5);
    }

    SetScrubFreq(0.75);

    if (GetTaskMoveNetworkState(PlayerPedId()) !== 'Scrub_Right_Leg') {
      const timeStarted = GetCloudTimeAsInt();
      console.log('Should start to transition to right leg');

      while (GetCloudTimeAsInt() - timeStarted < 15000) {
        console.log(GetCloudTimeAsInt() - timeStarted);
        if (GetTaskMoveNetworkState(PlayerPedId()) !== 'Scrub_Right_Leg') {
          RequestTaskMoveNetworkStateTransition(PlayerPedId(), 'Scrub_Right_Leg');
        }
        await Delay(1);
      }
    }

    // const particleHandle = StartParticleFxLoopedOnPedBone(
    //   'scr_mg_bathing_foam_head',
    //   PlayerPedId(),
    //   0.0,
    //   0.0,
    //   0.0,
    //   0.0,
    //   0.0,
    //   0.0,
    //   21030,
    //   0.4,
    //   false,
    //   false,
    //   false,
    // );
    // allParticles.push(particleHandle);
  },
  false,
);
on('onResourceStop', (resource: string) => {
  if (resource !== GetCurrentResourceName()) return;
  if (DoesVolumeExist(volume1)) {
    DeleteVolume(volume1);
  }
  if (DoesVolumeExist(volume2)) {
    DeleteVolume(volume2);
  }
  if (DoesParticleFxLoopedExist(particles)) {
    RemoveParticleFx(particles, false);
  }
  if (Citizen.invokeNative('0x927B810E43E99932', 'bath_orbit_cam', Citizen.resultAsInteger()) as number) {
    Citizen.invokeNative('0x0A5A4F1979ABB40E', 'bath_orbit_cam');
  }
  if (proxyIndex !== -1) {
    Citizen.invokeNative('0xBFCB17895BB99E4E', proxyIndex, false);
  }
  ClearPedTasks(PlayerPedId());
  Citizen.invokeNative('0x69D65E89FFD72313', false, false);
  Citizen.invokeNative('0x77ED170667F50170', 'BATHING');
  SetPedCanLegIk(PlayerPedId(), true);
  SetPedLegIkMode(PlayerPedId(), 2);
  allParticles.forEach((particle) => {
    RemoveParticleFx(particle, true);
  });
});
