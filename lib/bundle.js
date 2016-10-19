(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("draft-js"), require("immutable"), require("lodash.debounce"), require("transcript-model"), require("node-uuid"), require("react-bootstrap"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "draft-js", "immutable", "lodash.debounce", "transcript-model", "node-uuid", "react-bootstrap"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("react"), require("draft-js"), require("immutable"), require("lodash.debounce"), require("transcript-model"), require("node-uuid"), require("react-bootstrap")) : factory(root["react"], root["draft-js"], root["immutable"], root["lodash.debounce"], root["transcript-model"], root["node-uuid"], root["react-bootstrap"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_12__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _draftJs = __webpack_require__(2);

	var _immutable = __webpack_require__(3);

	var _immutable2 = _interopRequireDefault(_immutable);

	var _lodash = __webpack_require__(4);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _transcriptModel = __webpack_require__(5);

	var _convertFromTranscript = __webpack_require__(6);

	var _convertFromTranscript2 = _interopRequireDefault(_convertFromTranscript);

	var _convertToTranscript = __webpack_require__(8);

	var _convertToTranscript2 = _interopRequireDefault(_convertToTranscript);

	var _updateBlock = __webpack_require__(9);

	var _updateBlock2 = _interopRequireDefault(_updateBlock);

	var _TranscriptEditorBlock = __webpack_require__(11);

	var _TranscriptEditorBlock2 = _interopRequireDefault(_TranscriptEditorBlock);

	var _TranscriptEditorWord = __webpack_require__(13);

	var _TranscriptEditorWord2 = _interopRequireDefault(_TranscriptEditorWord);

	var _TranscriptEntities = __webpack_require__(10);

	__webpack_require__(14);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TranscriptEditor = function (_Component) {
	  _inherits(TranscriptEditor, _Component);

	  function TranscriptEditor(props) {
	    _classCallCheck(this, TranscriptEditor);

	    var _this = _possibleConstructorReturn(this, (TranscriptEditor.__proto__ || Object.getPrototypeOf(TranscriptEditor)).call(this, props));

	    _this.state = {
	      editorState: _draftJs.EditorState.createEmpty(),
	      speakers: []
	    };

	    _this.onChange = _this.onChange.bind(_this);
	    _this.handleBeforeInput = _this.handleBeforeInput.bind(_this);
	    _this.handleReturn = _this.handleReturn.bind(_this);
	    _this.blockRenderer = _this.blockRenderer.bind(_this);

	    _this.debouncedSendTranscriptUpdate = (0, _lodash2.default)(_this.sendTranscriptUpdate, 500);

	    _this.decorator = new _draftJs.CompositeDecorator([{
	      strategy: function strategy(contentBlock, callback) {
	        contentBlock.findEntityRanges(function (character) {
	          var entityKey = character.getEntity();
	          if (entityKey === null) {
	            return false;
	          }
	          var entityType = _draftJs.Entity.get(entityKey).getType();
	          return entityType === _TranscriptEntities.TRANSCRIPT_WORD || entityType === _TranscriptEntities.TRANSCRIPT_PLACEHOLDER;
	        }, callback);
	      },
	      component: _TranscriptEditorWord2.default
	    }]);
	    return _this;
	  }

	  _createClass(TranscriptEditor, [{
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var transcript = nextProps.transcript;
	      if (transcript && this.state.transcript !== transcript) {
	        var _convertFromTranscrip = (0, _convertFromTranscript2.default)(transcript);

	        var contentState = _convertFromTranscrip.contentState;
	        var speakers = _convertFromTranscrip.speakers;


	        this.sendTranscriptUpdate(contentState, speakers);

	        this.setState({
	          editorState: _draftJs.EditorState.createWithContent(contentState, this.decorator),
	          speakers: speakers
	        });
	      }
	    }
	  }, {
	    key: 'onChange',
	    value: function onChange(editorState) {
	      var _this2 = this;

	      var contentState = editorState.getCurrentContent();
	      var previousEditorState = this.state.editorState;
	      var lastChangeType = editorState.getLastChangeType();
	      if (lastChangeType !== 'undo' && contentState !== previousEditorState.getCurrentContent()) {
	        var _ret = function () {
	          _this2.debouncedSendTranscriptUpdate(contentState, _this2.state.speakers);

	          var selectionState = editorState.getSelection();
	          var startKey = selectionState.getStartKey();
	          var previousStartKey = previousEditorState.getSelection().getStartKey();

	          var blockMap = contentState.getBlockMap();

	          var newBlockMap = blockMap.reduce(function (_newBlockMap, contentBlock, blockKey) {
	            var newContentBlock = contentBlock;

	            // Is this the block currently being edited?
	            if (blockKey === startKey) {
	              // Has everything been deleted from the block?
	              if (newContentBlock.characterList.isEmpty()) {
	                // Remove it
	                return _newBlockMap;
	              }

	              var startOffset = selectionState.getStartOffset();
	              // Have we merged blocks?
	              if (blockMap.size < previousEditorState.getCurrentContent().getBlockMap().size) {
	                // Do we have two adjacent words?
	                if (_draftJs.Entity.get(newContentBlock.characterList.get(startOffset).entity).type === _TranscriptEntities.TRANSCRIPT_WORD && _draftJs.Entity.get(newContentBlock.characterList.get(startOffset - 1).entity).type === _TranscriptEntities.TRANSCRIPT_WORD) {
	                  // Add a space
	                  newContentBlock = newContentBlock.set('characterList', newContentBlock.characterList.insert(startOffset, _draftJs.CharacterMetadata.applyEntity(_draftJs.CharacterMetadata.create(), _draftJs.Entity.create(_TranscriptEntities.TRANSCRIPT_SPACE, 'IMMUTABLE', null)))).set('text', '' + newContentBlock.text.slice(0, startOffset) + (' ' + newContentBlock.text.slice(startOffset)));
	                }
	              }

	              // Update the entities
	              newContentBlock = newContentBlock.merge((0, _updateBlock2.default)(newContentBlock, previousEditorState.getCurrentContent().getBlockForKey(blockKey)));

	              // Have we created a leading space? (e.g. when splitting a block)
	              if (_draftJs.Entity.get(newContentBlock.characterList.first().entity).type === _TranscriptEntities.TRANSCRIPT_SPACE) {
	                // Remove the leading space
	                newContentBlock = newContentBlock.set('characterList', newContentBlock.characterList.shift()).set('text', newContentBlock.text.substring(1));
	              }

	              // Is this block missing data? (e.g. it's been split)
	              if (newContentBlock.data.isEmpty()) {
	                // Copy the previous block's data
	                newContentBlock = newContentBlock.set('data', _newBlockMap.last().data);
	              }
	              // Otherwise is this the block previously being edited? (e.g. that was split)
	            } else if (blockKey === previousStartKey) {
	              // Have we created a trailing space?
	              if (_draftJs.Entity.get(newContentBlock.characterList.last().entity).type === _TranscriptEntities.TRANSCRIPT_SPACE) {
	                // Remove the trailing space
	                newContentBlock = newContentBlock.set('characterList', newContentBlock.characterList.pop()).set('text', newContentBlock.text.substring(0, newContentBlock.text.length - 1));
	              }
	            }

	            return _newBlockMap.set(blockKey, newContentBlock);
	          }, new _immutable2.default.OrderedMap());

	          var newContentState = contentState.set('blockMap', newBlockMap);
	          return {
	            v: _this2.setState({
	              editorState: _draftJs.EditorState.push(previousEditorState, newContentState, lastChangeType)
	            })
	          };
	        }();

	        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	      }
	      return this.setState({
	        editorState: editorState
	      });
	    }
	  }, {
	    key: 'handleBeforeInput',
	    value: function handleBeforeInput(chars) {
	      // Don't allow inserting additional spaces between words
	      if (chars === ' ') {
	        var editorState = this.state.editorState;
	        var selectionState = editorState.getSelection();
	        var startKey = selectionState.getStartKey();
	        var startOffset = selectionState.getStartOffset();
	        var selectedBlock = editorState.getCurrentContent().getBlockForKey(startKey);
	        var entityKeyBefore = selectedBlock.getEntityAt(startOffset - 1);
	        if (entityKeyBefore && _draftJs.Entity.get(entityKeyBefore).type === _TranscriptEntities.TRANSCRIPT_SPACE) {
	          return true;
	        }
	      }
	      return false;
	    }
	  }, {
	    key: 'blockRenderer',
	    value: function blockRenderer() {
	      return {
	        component: _TranscriptEditorBlock2.default,
	        props: {
	          speakers: this.state.speakers
	        }
	      };
	    }
	  }, {
	    key: 'sendTranscriptUpdate',
	    value: function sendTranscriptUpdate(contentState, speakers) {
	      this.props.onTranscriptUpdate((0, _convertToTranscript2.default)(contentState, speakers));
	    }
	  }, {
	    key: 'handleReturn',
	    value: function handleReturn() {
	      var editorState = this.state.editorState;
	      var selectionState = editorState.getSelection();
	      var startKey = selectionState.getStartKey();
	      var startOffset = selectionState.getStartOffset();
	      var selectedBlock = editorState.getCurrentContent().getBlockForKey(startKey);
	      var entityKeyBefore = selectedBlock.getEntityAt(startOffset - 1);
	      var entityKeyAfter = selectedBlock.getEntityAt(startOffset);
	      if (entityKeyBefore && _draftJs.Entity.get(entityKeyBefore).type === _TranscriptEntities.TRANSCRIPT_SPACE || entityKeyAfter && _draftJs.Entity.get(entityKeyAfter).type === _TranscriptEntities.TRANSCRIPT_SPACE) {
	        return false;
	      }
	      return true;
	    }
	  }, {
	    key: 'handlePastedText',
	    value: function handlePastedText() {
	      return true;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var editorState = this.state.editorState;

	      return _react2.default.createElement(
	        'div',
	        { className: 'TranscriptEditor' },
	        _react2.default.createElement(_draftJs.Editor, {
	          editorState: editorState,
	          onChange: this.onChange,
	          handleReturn: this.handleReturn,
	          handleBeforeInput: this.handleBeforeInput,
	          handlePastedText: this.handlePastedText,
	          blockRendererFn: this.blockRenderer
	        })
	      );
	    }
	  }]);

	  return TranscriptEditor;
	}(_react.Component);

	TranscriptEditor.propTypes = {
	  transcript: _react2.default.PropTypes.instanceOf(_transcriptModel.Transcript),
	  onTranscriptUpdate: _react2.default.PropTypes.func
	};

	exports.default = TranscriptEditor;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _draftJs = __webpack_require__(2);

	var _immutable = __webpack_require__(3);

	var _immutable2 = _interopRequireDefault(_immutable);

	var _nodeUuid = __webpack_require__(7);

	var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var convertFromTranscript = function convertFromTranscript(transcript) {
	  var contentBlocks = transcript.get('segments').map(function (segment, segmentIndex) {
	    return new _draftJs.ContentBlock({
	      key: segmentIndex.toString(),
	      characterList: segment.get('words').map(function (word) {
	        var entity = _draftJs.Entity.create('TRANSCRIPT_WORD', 'MUTABLE', {
	          start: word.get('start'),
	          end: word.get('end'),
	          id: word.get('id') || _nodeUuid2.default.v4()
	        });
	        return new _immutable2.default.List(word.get('text').split('').map(function () {
	          return _draftJs.CharacterMetadata.applyEntity(_draftJs.CharacterMetadata.create(), entity);
	        }));
	      }).interpose(new _immutable2.default.List([_draftJs.CharacterMetadata.applyEntity(_draftJs.CharacterMetadata.create(), _draftJs.Entity.create('TRANSCRIPT_SPACE', 'IMMUTABLE', null))])).flatten(1),
	      text: segment.get('words').map(function (w) {
	        return w.get('text');
	      }).join(' '),
	      data: new _immutable2.default.Map({ speaker: segment.get('speaker') })
	    });
	  });

	  var contentState = _draftJs.ContentState.createFromBlockArray(contentBlocks);

	  var speakers = transcript.get('speakers');

	  return { contentState: contentState, speakers: speakers };
	};

	exports.default = convertFromTranscript;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _draftJs = __webpack_require__(2);

	var _immutable = __webpack_require__(3);

	var _immutable2 = _interopRequireDefault(_immutable);

	var _transcriptModel = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var convertToTranscript = function convertToTranscript(contentState, speakers) {
	  var segments = contentState.getBlockMap().toArray().map(function (block) {
	    var words = [];

	    block.findEntityRanges(function (character) {
	      var entityKey = character.getEntity();
	      if (entityKey === null) {
	        return false;
	      }
	      return _draftJs.Entity.get(entityKey).getType() === 'TRANSCRIPT_WORD';
	    }, function (start, end) {
	      var entity = _draftJs.Entity.get(block.getEntityAt(start));
	      var text = block.getText().substring(start, end);
	      words.push(new _transcriptModel.TranscriptWord({
	        start: entity.data.start,
	        end: entity.data.end,
	        id: entity.data.id,
	        text: text
	      }));
	    });

	    return new _transcriptModel.TranscriptSegment({
	      words: new _immutable2.default.List(words),
	      speaker: block.data.get('speaker')
	    });
	  });

	  return new _transcriptModel.Transcript({
	    segments: new _immutable2.default.List(segments),
	    speakers: speakers
	  });
	};

	exports.default = convertToTranscript;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _immutable = __webpack_require__(3);

	var _immutable2 = _interopRequireDefault(_immutable);

	var _draftJs = __webpack_require__(2);

	var _TranscriptEntities = __webpack_require__(10);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var updateBlock = function updateBlock(contentBlock) {
	  return contentBlock.characterList.reduce(function (_ref, character, index) {
	    var characterList = _ref.characterList;
	    var text = _ref.text;

	    // Is this the first character?
	    if (!characterList.isEmpty()) {
	      var previousCharacter = characterList.last();
	      // Does the previous character have an entity?
	      if (previousCharacter.entity) {
	        // Does the previous character have a different entity?
	        if (character.entity) {
	          var entity = _draftJs.Entity.get(character.entity);
	          var previousEntity = _draftJs.Entity.get(previousCharacter.entity);
	          // Does the different entity have the same type?
	          if (entity.type === previousEntity.type && entity !== previousEntity) {
	            // Merge the entities
	            _draftJs.Entity.mergeData(previousCharacter.entity, { end: entity.data.end });
	            return {
	              characterList: characterList.push(_draftJs.CharacterMetadata.applyEntity(character, previousCharacter.entity)),
	              text: text + contentBlock.text[index]
	            };
	          } else if (entity.type === _TranscriptEntities.TRANSCRIPT_SPACE && previousEntity.type === _TranscriptEntities.TRANSCRIPT_SPACE) {
	            return {
	              characterList: characterList,
	              text: text
	            };
	          }
	        }
	      } else {
	        // Set it to the entity of this character
	        return {
	          characterList: characterList.set(-1, _draftJs.CharacterMetadata.applyEntity(previousCharacter, character.entity)).push(character),
	          text: text + contentBlock.text[index]
	        };
	      }
	    }
	    return {
	      characterList: characterList.push(character),
	      text: text + contentBlock.text[index]
	    };
	  }, { characterList: new _immutable2.default.List(), text: '' });
	};

	exports.default = updateBlock;
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var TRANSCRIPT_SPACE = exports.TRANSCRIPT_SPACE = 'TRANSCRIPT_SPACE';
	var TRANSCRIPT_WORD = exports.TRANSCRIPT_WORD = 'TRANSCRIPT_WORD';
	var TRANSCRIPT_PLACEHOLDER = exports.TRANSCRIPT_PLACEHOLDER = 'TRANSCRIPT_PLACEHOLDER';

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _draftJs = __webpack_require__(2);

	var _reactBootstrap = __webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TranscriptEditorBlock = function (_Component) {
	  _inherits(TranscriptEditorBlock, _Component);

	  function TranscriptEditorBlock() {
	    _classCallCheck(this, TranscriptEditorBlock);

	    return _possibleConstructorReturn(this, (TranscriptEditorBlock.__proto__ || Object.getPrototypeOf(TranscriptEditorBlock)).apply(this, arguments));
	  }

	  _createClass(TranscriptEditorBlock, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        _reactBootstrap.Row,
	        null,
	        _react2.default.createElement(
	          _reactBootstrap.Col,
	          {
	            xs: 3,
	            contentEditable: false,
	            style: {
	              MozUserSelect: 'none',
	              WebkitUserSelect: 'none',
	              msUserSelect: 'none'
	            }
	          },
	          'Speaker ',
	          this.props.block.data.get('speaker')
	        ),
	        _react2.default.createElement(
	          _reactBootstrap.Col,
	          { xs: 9 },
	          _react2.default.createElement(_draftJs.EditorBlock, this.props)
	        )
	      );
	    }
	  }]);

	  return TranscriptEditorBlock;
	}(_react.Component);

	TranscriptEditorBlock.propTypes = {
	  block: _react2.default.PropTypes.object
	};

	exports.default = TranscriptEditorBlock;
	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_12__;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _draftJs = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TranscriptEditorWord = function (_Component) {
	  _inherits(TranscriptEditorWord, _Component);

	  function TranscriptEditorWord() {
	    _classCallCheck(this, TranscriptEditorWord);

	    return _possibleConstructorReturn(this, (TranscriptEditorWord.__proto__ || Object.getPrototypeOf(TranscriptEditorWord)).apply(this, arguments));
	  }

	  _createClass(TranscriptEditorWord, [{
	    key: 'render',
	    value: function render() {
	      var entity = _draftJs.Entity.get(this.props.entityKey);
	      var titleString = '' + entity.data.start.toFixed(2) + (' - ' + entity.data.end.toFixed(2));
	      return _react2.default.createElement(
	        'span',
	        {
	          title: titleString,
	          style: {
	            backgroundColor: '#d4eaff',
	            border: '1px solid #ddd',
	            padding: '0 2px'
	          },
	          id: 'word-' + entity.data.id
	        },
	        this.props.children
	      );
	    }
	  }], [{
	    key: 'getId',
	    value: function getId(entityKey) {
	      return 'word-' + entityKey;
	    }
	  }]);

	  return TranscriptEditorWord;
	}(_react.Component);

	TranscriptEditorWord.propTypes = {
	  entityKey: _react2.default.PropTypes.string,
	  children: _react2.default.PropTypes.array
	};

	exports.default = TranscriptEditorWord;
	module.exports = exports['default'];

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(15);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(17)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./TranscriptEditor.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./TranscriptEditor.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(16)();
	// imports


	// module
	exports.push([module.id, ".TranscriptEditor {\n  border: 1px solid #ddd;\n  padding: 15px;\n  cursor: text;\n}\n\n.TranscriptEditor .row {\n  margin: -15px -15px -30px;\n}\n\n.TranscriptEditor .public-DraftStyleDefault-block {\n  margin-bottom: 10px;\n}\n", ""]);

	// exports


/***/ },
/* 16 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ])
});
;