import { h, InsertHook, VNode } from 'snabbdom';

import * as cg from 'chessgroundx/types';
import * as util from 'chessgroundx/util';

import { BoardMarkType, ColorName, CountingType, MaterialPointType, PieceSoundType, PromotionSuffix, PromotionType, TimeControlType } from './chess';
import { _ } from './i18n';
import { calculateDiff, Equivalence, MaterialDiff } from './material';

export interface BoardFamily {
    readonly dimensions: cg.BoardDimensions;
    readonly cg: string;
    readonly boardCSS: string[];
}

export interface PieceFamily {
    readonly pieceCSS: string[];
}

export const BOARD_FAMILIES: Record<string, BoardFamily> = {
    standard8x8: { dimensions: { width: 8, height: 8 }, cg: "cg-512", boardCSS: ["8x8brown.svg", "8x8blue.svg", "8x8green.svg", "8x8maple.jpg", "8x8olive.jpg", "8x8santa.png", "8x8wood2.jpg", "8x8wood4.jpg", "8x8ic.svg", "8x8purple.svg"] },
    standard9x9: { dimensions: { width: 9, height: 9 }, cg: "cg-540", boardCSS: ["9x9mansindam.svg", "9x9brown.svg", "9x9blue.svg", "9x9green.svg", "9x9maple.jpg", "9x9olive.jpg"] },
    standard10x8: { dimensions: { width: 10, height: 8 }, cg: "cg-640", boardCSS: ["10x8brown.svg", "10x8blue.svg", "10x8green.svg", "10x8maple.jpg", "10x8olive.jpg"] },
    standard10x10: { dimensions: { width: 10, height: 10 }, cg: "cg-640-640", boardCSS: ["10x10brown.svg", "10x10blue.svg", "10x10green.svg", "10x10maple.jpg", "10x10olive.jpg"] },
    grand10x10: { dimensions: { width: 10, height: 10}, cg: "cg-640-640", boardCSS: ["Grandboard.svg", "10x10brown.svg", "10x10blue.svg", "10x10green.svg", "10x10maple.jpg", "10x10mapleGrand.png"] },
    makruk8x8: { dimensions: { width: 8, height: 8 }, cg: "cg-512", boardCSS: ["makruk2.svg", "makruk.svg", "makrukWhite.svg", "makruk.jpg", "makrukWood.png"] },
    sittuyin8x8: { dimensions: { width: 8, height: 8 }, cg: "cg-512", boardCSS: ["sittuyin2.svg", "sittuyin.svg", "sittuyin.jpg", "sittuyingreen.svg", "sittuyinGrainBrown.svg", "sittuyinWood.png"] },
    shogi9x9: { dimensions: { width: 9, height: 9 }, cg: "cg-576", boardCSS: ["shogi.svg", "Shogiban1.png", "Shogiban2.png", "shogic.svg", "ShogiMaple.png", 'ShogiGrayTexture.png', "ShogiSpace1.svg", "dobutsu.png", "ShogiOak.png"] },
    shogi7x7: { dimensions: { width: 7, height: 7 }, cg: "cg-448-516", boardCSS: ["ToriPlain.svg", "ToriWood.svg", "ToriDaySky.svg", "ToriNightSky.svg"] },
    shogi5x5: { dimensions: { width: 5, height: 5 }, cg: "cg-260", boardCSS: ["minishogi.svg", "MiniboardWood1.png", "MiniboardWood2.png", "MinishogiDobutsu.svg", "MinishogiDobutsu2.svg"] },
    shogi5x6: { dimensions: { width: 5, height: 6 }, cg: "cg-260-360", boardCSS: ["gorogoro.svg", "gorogoroboard.svg", "gorogoro2.svg", "GorogoroWood.png"] },
    shogi3x4: { dimensions: { width: 3, height: 4 }, cg: "cg-156", boardCSS: ["doubutsuboard.svg", "dobutsu3x4.svg"] },
    xiangqi9x10: { dimensions: { width: 9, height: 10 }, cg: "cg-576-640", boardCSS: ["xiangqi.svg", "xiangqic.svg", "xiangqiCTexture.png", "xiangqiPaper.png", "xiangqiWood.png", "xiangqiDark.svg", "xiangqiWikimedia.svg", "xiangqiLightWood.png", "xiangqiSand.svg"] },
    xiangqi7x7: { dimensions: { width: 7, height: 7 }, cg: "cg-448", boardCSS: ["minixiangqi.svg", "minixiangqiw.png", "minixqlg.svg"] },
    janggi9x10: { dimensions: { width: 9, height: 10 }, cg: "cg-576-640", boardCSS: ["JanggiBrown.svg", "JanggiPaper.png", "JanggiWood.png", "JanggiDark.svg", "JanggiWoodDark.svg", "JanggiStone.svg"] },
    shogun8x8: { dimensions: { width: 8, height: 8 }, cg: "cg-512", boardCSS: ["ShogunPlain.svg", "ShogunMaple.png", "ShogunMaple2.png", "ShogunBlue.svg", "8x8brown.svg", "8x8maple.jpg"] },
    chak9x9:{ dimensions: { width: 9, height: 9 }, cg: "cg-540", boardCSS: ["StandardChakBoard.svg", "ColoredChakBoard.svg", "ChakArt.jpg"] },
    chennis7x7:{ dimensions: { width: 7, height: 7 }, cg: "cg-448", boardCSS: ["WimbledonBoard.svg", "FrenchOpenBoard.svg", "USOpenBoard.svg"] },
};

export const PIECE_FAMILIES: Record<string, PieceFamily> = {
    standard: { pieceCSS: ["standard", "green", "alpha", "chess_kaneo", "santa", "maestro", "dubrovny", "disguised", "atopdown"] },
    capa: { pieceCSS: ["capa0", "capa1", "capa2", "capa3", "capa4", "capa5", "disguised"] },
    seirawan: { pieceCSS: ["seir1", "seir0", "seir2", "seir3", "seir4", "seir5", "disguised"] },
    makruk: { pieceCSS: ["makrukwb", "makrukwr", "makruk", "makruks", "makruki", "makrukc", "disguised"] },
    sittuyin: { pieceCSS: ["sittuyins", "sittuyinkagr", "sittuyinkabr", "sittuyinm", "sittuyini", "sittuyincb", "disguised"] },
    asean: { pieceCSS: ["aseani", "aseanm", "aseanc", "aseans", "aseancb", "disguised"] },
    shogi: { pieceCSS: ["shogik", "shogi", "shogiw", "shogip", "shogim", "shogip3d", "shogikw3d", "shogid", "shogiim", "shogibw", "portk", "porti", "disguised"] },
    kyoto: { pieceCSS: ["kyoto", "kyotok", "kyotoks", "kyotoi", "kyotod", "disguised"] },
    dobutsu: { pieceCSS: ["dobutsu", "disguised"] },
    tori: { pieceCSS: ["torii", "torik", "torim", "porti", "disguised"] },
    xiangqi: { pieceCSS: ["xiangqi2d", "xiangqi2di", "xiangqi", "xiangqict3", "xiangqihnz", "xiangqict2", "xiangqihnzw", "xiangqict2w", "xiangqiwikim", "xiangqiKa", "xiangqittxqhnz", "xiangqittxqintl", "disguised", "euro"] },
    janggi: { pieceCSS: ["janggihb", "janggihg", "janggiikak", "janggiikaw", "janggikak", "janggikaw", "janggiib", "janggiig", "disguised"] },
    shako: { pieceCSS: ["shako0", "shako1", "shako2", "disguised"] },
    shogun: { pieceCSS: ["shogun0", "shogun1", "shogun2", "shogun3", "shogun4", "shogun5", "disguised"] },
    orda: { pieceCSS: ["orda0", "orda1", "disguised"] },
    synochess: { pieceCSS: ["synochess0", "synochess1", "synochess2", "synochess3", "synochess4", "synochess5", "disguised"] },
    hoppel: { pieceCSS: ["hoppel0", "hoppel1", "hoppel2", "disguised"] },
    shinobi: { pieceCSS: ["shinobi0", "shinobi1", "disguised"] },
    empire: { pieceCSS: ["empire0", "empire1", "disguised"] },
    ordamirror: { pieceCSS: ["ordamirror0", "ordamirror1", "disguised"] },
    chak: { pieceCSS: ["chak0", "disguised"] },
    chennis: { pieceCSS: ["chennis0", "chennis1", "chennis2", "chennis3", "chennis4", "disguised"] },
    spartan: { pieceCSS: ["spartan0", "disguised"] },
    mansindam: { pieceCSS: ["mansindam2", "mansindam1", "mansindam3", "disguised"] },
};

export interface Variant {
    readonly name: string;
    readonly _displayName: string;
    readonly displayName: (chess960?: boolean) => string;
    readonly _tooltip: string;
    readonly tooltip: string;
    readonly chess960: boolean;
    readonly _icon: string;
    readonly _icon960: string;
    readonly icon: (chess960?: boolean) => string;
    readonly startFen: string;
    readonly boardFamily: keyof typeof BOARD_FAMILIES;
    readonly board: BoardFamily;
    readonly pieceFamily: keyof typeof PIECE_FAMILIES;
    readonly piece: PieceFamily;
    readonly colors: {
        readonly first: ColorName;
        readonly second: ColorName;
    }
    readonly pieceRow: Record<cg.Color, cg.Role[]>;
    readonly kingRoles: cg.Role[];
    readonly pocket?: {
        readonly roles: Record<cg.Color, cg.Role[]>;
        readonly captureToHand: boolean;
    };
    readonly promotion: {
        readonly type: PromotionType;
        readonly order: PromotionSuffix[];
        readonly roles: cg.Role[];
        readonly strict?: {
            readonly isPromoted: (piece: cg.Piece, pos: cg.Pos) => boolean;
        };
        readonly autoPromoteable: boolean;
    };
    readonly rules: {
        readonly defaultTimeControl: TimeControlType;
        readonly enPassant: boolean;
        readonly gate: boolean;
        readonly duck: boolean;
        readonly pass: boolean;
        readonly setup: boolean;
    };
    readonly material: {
        readonly showDiff: boolean;
        readonly initialDiff: MaterialDiff;
        readonly equivalences: Equivalence;
    };
    readonly ui: {
        readonly counting?: CountingType;
        readonly materialPoint?: MaterialPointType;
        readonly showPromoted: boolean;
        readonly pieceSound: PieceSoundType;
        readonly boardMark: BoardMarkType | '';
    };
    readonly alternateStart?: Record<string, string>;
}

function variant(config: VariantConfig): Variant {
    return {
        name: config.name,
        _displayName: config.displayName ?? config.name,
        displayName: function (chess960 = false) { return _(this._displayName).toUpperCase() + (chess960 ? '960' : ''); },
        _tooltip: config.tooltip,
        get tooltip() { return _(this._tooltip) },
        chess960: !!config.chess960,
        _icon: config.icon,
        _icon960: config.icon960 ?? config.icon,
        icon: function (chess960 = false) { return chess960 ? this._icon960 : this._icon; },
        startFen: config.startFen,
        boardFamily: config.boardFamily,
        board: BOARD_FAMILIES[config.boardFamily],
        pieceFamily: config.pieceFamily,
        piece: PIECE_FAMILIES[config.pieceFamily],
        colors: config.colors ?? { first: 'White', second: 'Black' },
        pieceRow: Array.isArray(config.pieceRow) ? {
            white: config.pieceRow.map(util.roleOf),
            black: config.pieceRow.map(util.roleOf),
        } : {
            white: config.pieceRow.white.map(util.roleOf),
            black: config.pieceRow.black.map(util.roleOf),
        },
        kingRoles: (config.kingRoles ?? ['k']).map(util.roleOf),
        pocket: config.pocket ? {
            roles: Array.isArray(config.pocket.roles) ? {
                white: config.pocket.roles.map(util.roleOf),
                black: config.pocket.roles.map(util.roleOf),
            } : {
                white: config.pocket.roles.white.map(util.roleOf),
                black: config.pocket.roles.black.map(util.roleOf),
            },
            captureToHand: config.pocket.captureToHand,
        } : undefined,
        promotion: {
            type: config.promotion?.type ?? 'regular',
            order: config.promotion?.order ?? (config.promotion?.type === 'shogi' ? ['+', ''] : ['q', 'c', 'e', 'a', 'h', 'n', 'r', 'b', 'p']),
            roles: (config.promotion?.roles ?? ['p']).map(util.roleOf),
            strict: config.promotion?.strict,
            get autoPromoteable() { return this.order.length > 2 },
        },
        rules: {
            defaultTimeControl: config.rules?.defaultTimeControl ?? 'incremental',
            enPassant: !!config.rules?.enPassant,
            gate: !!config.rules?.gate,
            duck: !!config.rules?.duck,
            pass: !!config.rules?.pass,
            setup: !!config.rules?.setup,
        },
        material: {
            showDiff: !config.pocket?.captureToHand,
            initialDiff: calculateDiff(config.startFen, BOARD_FAMILIES[config.boardFamily].dimensions, config.material?.equivalences ?? {}, !!config.pocket?.captureToHand),
            equivalences: config.material?.equivalences ?? {},
        },
        ui: {
            counting: config.ui?.counting,
            materialPoint: config.ui?.materialPoint,
            showPromoted: config.ui?.showPromoted ?? false,
            pieceSound: config.ui?.pieceSound ?? 'regular',
            boardMark: config.ui?.boardMark ?? '',
        },
        alternateStart: config.alternateStart,
    };
}

interface VariantConfig {
    // Name as defined in Fairy-Stockfish
    name: string;
    // Display name for use on the website (default: same as name)
    displayName?: string;
    // Tooltip displayed when variant name is hovered
    tooltip: string;
    // Start FEN for use in some client-side calculations
    startFen: string;
    // Whether it is possible to play a randomized starting positon (default: false)
    chess960?: boolean;
    // Icon letter in the site's font
    icon: string;
    // Icon of the 960 version (default: same as icon)
    icon960?: string;
    // Board appearance
    boardFamily: keyof typeof BOARD_FAMILIES;
    // Piece appearance
    pieceFamily: keyof typeof PIECE_FAMILIES;
    // Color names of each side for accurate color representation
    colors?: {             
        // (default: White)
        first: ColorName;
        // (default: Black)
        second: ColorName;
    }
    // Pieces on the editor's piece row
    // Use the record version if the pieces of each side are different
    pieceRow: cg.Letter[] | Record<cg.Color, cg.Letter[]>;
    // Pieces considered king for check marking (default: ['k'])
    kingRoles?: cg.Letter[];
    pocket?: {
        // Pieces in the pocket
        // Use the record version if the pieces of each side are different
        roles: cg.Letter[] | Record<cg.Color, cg.Letter[]>;
        // Whether captured pieces go to the pocket (Fairy's terminology)
        captureToHand: boolean;
    };
    promotion?: {
        // Promotion style
        // regular: (default) Pawns promote to one or more pieces (like chess)
        // shogi: Multiple pieces promote to another piece corresponding to it (like shogi)
        type: PromotionType;
        // Order of promotion choices to display, top choice will be chosen for auto-promote
        // (default: ["q", "c", "e", "a", "h", "n", "r", "b", "p"] for regular)
        // (default: ["+", ""] for shogi)
        order?: PromotionSuffix[];
        // Pieces that can promote (default: ['p'])
        roles?: cg.Letter[];
        // Whether a piece's promotion state strictly depends on its square (default: undefined)
        strict?: {
            // Returns true if and only if the given piece would be promoted on the given square
            isPromoted: (piece: cg.Piece, pos: cg.Pos) => boolean;
        };
    };
    // Miscellaneous rules useful for client-side processing
    // (default: false)
    rules?: {
        // Default time control (default: incremental)
        defaultTimeControl?: TimeControlType;
        // Chess's en passant
        enPassant?: boolean;
        // S-Chess gating
        gate?: boolean;
        // Duck Chess moving
        duck?: boolean;
        // Passing without moving a piece on board
        pass?: boolean;
        // Setup phase
        setup?: boolean;
    };
    // Material equivalences for material diff calculation
    // ex. { 'pl-piece': 'r-piece' } means the "+L" piece is treated as the "R" piece for material diff
    material?: {
        equivalences?: Equivalence;
    },
    // UI display info
    ui?: {
        // SEA variants' counting (default: undefined)
        counting?: CountingType;
        // Material point (default: undefined)
        materialPoint?: MaterialPointType;
        // Promoted pieces need to be represented in the FEN even if it's not a drop variant (default: false)
        showPromoted?: boolean;
        // Sound of the piece moving (default: regular)
        pieceSound?: PieceSoundType;
        // Board marking for special squares (default: '')
        boardMark?: BoardMarkType;
    };
    // Alternate starting positions, including handicaps
    alternateStart?: Record<string, string>;
}

export const VARIANTS: Record<string, Variant> = {
    antipawns: variant({
            name: "antipawns", tooltip: "antichess + horde but diff pawn structure.",
            startFen: "pppppppp/pppppppp/pppppppp/8/8/PPPPPPPP/PPPPPPPP/PPPPPPPP w - - 0 1",
            boardFamily: "standard8x8", pieceFamily: "standard",
            pieceRow: ["k", "q", "r", "b", "n", "p"],
            rules: { enPassant: true },
            icon: "♔",
    }),
    
    antihouse: variant({
            name: "antihouse", tooltip: "antichess + crazyhouse.",
            startFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            boardFamily: "standard8x8", pieceFamily: "standard",
            pieceRow: ["k", "q", "r", "b", "n", "p"],
            pocket: {
                roles: ["p", "n", "b", "r", "q"],
                captureToHand: true,
            },
            rules: { enPassant: true },
            chess960: true, icon: "♔", icon960: "♔",
          }),
    
    losers: variant({
            name: "losers", tooltip: "losers Chess.",
            startFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            boardFamily: "standard8x8", pieceFamily: "standard",
            pieceRow: ["k", "q", "r", "b", "n", "p"],
            rules: { enPassant: true },
            chess960: true, icon: "♔", icon960: "♔",
        }),

    coffeerace: variant({
            name: "coffeerace", tooltip: "AntiRacingkings.",
            startFen: "8/8/8/8/8/8/krbnNBRK/qrbnNBRQ w - - 0 1",
            boardFamily: "standard8x8", pieceFamily: "standard",
            pieceRow: ["k", "q", "r", "b", "n", "p"],
            rules: { enPassant: true },
            icon: "♔",
        }),        

    anti_antichess: variant({
            name: "anti_antichess", displayName: "anti-antichess", tooltip: "loose at antichess",
            startFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            boardFamily: "standard8x8", pieceFamily: "standard",
            pieceRow: ["k", "q", "r", "b", "n", "p"],
            rules: { enPassant: true },
            chess960: true, icon: "♔", icon960: "♔",
          }),
          
    antichess: variant({
      name: "antichess", tooltip: "capture all pieces.",
      startFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1",
      boardFamily: "standard8x8", pieceFamily: "standard",
      pieceRow: ["k", "q", "r", "b", "n", "p"],
      promotion: { type: "regular", order: ["q", "n", "r", "b", "p", "k"] },
      rules: { enPassant: true },
      chess960: true, icon: "♔", icon960: "♔",
    }),

    antiatomic: variant({   
        name: "antiatomic", tooltip: "Atomic+Antichess",
        startFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        boardFamily: "standard8x8", pieceFamily: "standard",
        pieceRow: ["k", "q", "r", "b", "n", "p"],
        rules: { enPassant: true },
        chess960: true, icon: "♔", icon960: "♔",
    }),
};

export const variants = Object.keys(VARIANTS);
const disabledVariants = [ "gothic", "gothhouse", "embassy", "embassyhouse", "gorogoro" ];
export const enabledVariants = variants.filter(v => !disabledVariants.includes(v));

// variants having 0 puzzle so far
export const noPuzzleVariants = [
    "3check",
    "placement",
    "sittuyin",
    "minishogi",
    "kyotoshogi",
    "gorogoroplus",
    "manchu",
    "minixiangqi",
    "grandhouse",
    "mansindam",
    "shinobi",
    "shinobiplus",
]

export const variantGroups: { [ key: string ]: { variants: string[] } } = {
    standard: { variants: [ "antichess", "losers", "antihouse", "coffeerace", "anti_antichess", "antiatomic" ] },
//    sea:      { variants: [ "makruk", "makpong", "cambodian", "sittuyin", "asean" ] },
//   shogi:    { variants: [ "shogi", "minishogi", "kyotoshogi", "dobutsu", "gorogoroplus", "torishogi" ] },
//   xiangqi:  { variants: [ "xiangqi", "manchu", "janggi", "minixiangqi" ] },
//   fairy:    { variants: [ "capablanca", "capahouse", "seirawan", "shouse", "grand", "grandhouse", "shako", "shogun", "hoppelpoppel" ] },
//   army:     { variants: [ "orda", "synochess", "shinobi", "empire", "ordamirror", "chak", "chennis" ] },
};

function variantGroupLabel(group: string): string {
    const groups: {[index: string]: string} = {
        standard: _("AntiChess Variants"),
//       sea: _("Makruk Variants"),
//        shogi: _("Shogi Variants"),
//        xiangqi: _("Xiangqi Variants"),
//        fairy: _("Fairy Piece Variants"),
//        army: _("New Army Variants"),
    }
    return groups[group];
}

export function selectVariant(id: string, selected: string, onChange: EventListener, hookInsert: InsertHook, disableds: string[] = []): VNode {
    return h('select#' + id, {
        props: { name: id },
        on: { change: onChange },
        hook: { insert: hookInsert },
    },
        Object.keys(variantGroups).map(g => {
            const group = variantGroups[g];
            return h('optgroup', { props: { label: variantGroupLabel(g) } }, group.variants.map(v => {
                const variant = VARIANTS[v];
                return h('option', {
                    props: { value: v, title: variant.tooltip },
                    attrs: { selected: v === selected, disabled: disableds.includes(variant.name) },
                }, variant.displayName(false));
            }));
        }),
    );
}

// Some variants need to be treated differently according to the FEN.
// Refer to server/fairy.py for more information
export function moddedVariant(variantName: string, chess960: boolean, pieces: cg.Pieces, castling: string): string {
    if (!chess960 && ["capablanca", "capahouse"].includes(variantName)) {
        const whiteKing = pieces.get('e1');
        const blackKing = pieces.get('e8');
        if (castling !== '-' &&
            ((!castling.includes('K') && !castling.includes('Q')) || (whiteKing && util.samePiece(whiteKing, { role: 'k-piece', color: 'white' }))) &&
            ((!castling.includes('k') && !castling.includes('q')) || (blackKing && util.samePiece(blackKing, { role: 'k-piece', color: 'black' }))))
            return variantName.includes("house") ? "embassyhouse" : "embassy";
    }
    return variantName;
}

// TODO merge into the variant type
export function notation(variant: Variant): cg.Notation {
    let cgNotation = cg.Notation.ALGEBRAIC;
    switch (variant.name) {
        case 'janggi':
            cgNotation = cg.Notation.JANGGI;
            break;
        case 'shogi':
        case 'minishogi':
        case 'kyotoshogi':
        case 'dobutsu':
        case 'gorogoro':
        case 'gorogoroplus':
        case 'torishogi':
            cgNotation = cg.Notation.SHOGI_ARBNUM;
            break;
        case 'xiangqi':
        case 'minixiangqi':
        // XIANGQI_WXF can't handle Mmanchu banner piece!
            cgNotation = cg.Notation.XIANGQI_ARBNUM;
            break;
    }
    return cgNotation;
}
