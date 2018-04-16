/**
 * Copyright 2018, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import dynamicSagas from 'src/dynamicSagas'

describe('dynamicSagas tests', () => {
  test('should create runSagas handler', () => {
    const sagaMiddleware = jest.fn()
    const createHandlers = jest.fn()
    const store = {}
    const param = 'test'
    const otherHandlers = { other: jest.fn() }

    createHandlers.mockReturnValue(otherHandlers)
    
    const handlers = dynamicSagas(sagaMiddleware)(createHandlers)(store, param)

    expect(handlers.runSagas).toBeDefined()
    expect(handlers.other).toBe(otherHandlers.other)
    expect(createHandlers).toBeCalledWith(store, param)
  })

  test('should run sagas', () => {
    const sagaMiddleware = { run: jest.fn() }
    const createHandlers = jest.fn()
    const store = {}
    const otherHandlers = { other: jest.fn() }

    const testSaga1 = jest.fn()
    const testSaga2 = jest.fn()

    createHandlers.mockReturnValue(otherHandlers)
    sagaMiddleware.run.mockReturnValue(jest.fn())
    
    const handlers = dynamicSagas(sagaMiddleware)(createHandlers)(store)

    handlers.runSagas({ testSaga1, testSaga2 })

    expect(sagaMiddleware.run).toBeCalledWith(testSaga1)
    expect(sagaMiddleware.run).toBeCalledWith(testSaga2)
  })

  test('should only run sagas once', () => {
    const sagaMiddleware = { run: jest.fn() }
    const createHandlers = jest.fn()
    const store = {}
    const otherHandlers = { other: jest.fn() }

    const testSaga = jest.fn()

    createHandlers.mockReturnValue(otherHandlers)
    sagaMiddleware.run.mockReturnValue(jest.fn())
    
    const handlers = dynamicSagas(sagaMiddleware)(createHandlers)(store)

    handlers.runSagas({ testSaga })
    handlers.runSagas({ testSaga })

    expect(sagaMiddleware.run).toBeCalledWith(testSaga)
    expect(sagaMiddleware.run).toHaveBeenCalledTimes(1)
  })
})
