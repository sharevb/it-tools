import { translate as t } from '@/plugins/i18n.plugin';

export const codesByCategories: {
  category: string
  codes: {
    code: number
    name: string
    description: string
    type: 'HTTP' | 'WebDav'
  }[]
}[] = [
  {
    category: t('tools.http-status-codes.constants.text.1xx-informational-response'),
    codes: [
      {
        code: 100,
        name: t('tools.http-status-codes.constants.text.continue'),
        description: t('tools.http-status-codes.constants.text.waiting-for-the-client-to-emit-the-body-of-the-request'),
        type: 'HTTP',
      },
      {
        code: 101,
        name: t('tools.http-status-codes.constants.text.switching-protocols'),
        description: t('tools.http-status-codes.constants.text.the-server-has-agreed-to-change-protocol'),
        type: 'HTTP',
      },
      {
        code: 102,
        name: t('tools.http-status-codes.constants.text.processing'),
        description: t('tools.http-status-codes.constants.text.the-server-is-processing-the-request-but-no-response-is-available-yet'),
        type: 'WebDav',
      },
      {
        code: 103,
        name: t('tools.http-status-codes.constants.text.early-hints'),
        description: t('tools.http-status-codes.constants.text.the-server-returns-some-response-headers-before-final-http-message'),
        type: 'HTTP',
      },
    ],
  },
  {
    category: t('tools.http-status-codes.constants.text.2xx-success'),
    codes: [
      {
        code: 200,
        name: 'OK',
        description: t('tools.http-status-codes.constants.text.standard-response-for-successful-http-requests'),
        type: 'HTTP',
      },
      {
        code: 201,
        name: t('tools.http-status-codes.constants.text.created'),
        description: t('tools.http-status-codes.constants.text.the-request-has-been-fulfilled-resulting-in-the-creation-of-a-new-resource'),
        type: 'HTTP',
      },
      {
        code: 202,
        name: t('tools.http-status-codes.constants.text.accepted'),
        description: t('tools.http-status-codes.constants.text.the-request-has-been-accepted-for-processing-but-the-processing-has-not-been-completed'),
        type: 'HTTP',
      },
      {
        code: 203,
        name: t('tools.http-status-codes.constants.text.non-authoritative-information'),
        description:
          t('tools.http-status-codes.constants.text.the-request-is-successful-but-the-content-of-the-original-request-has-been-modified-by-a-transforming-proxy'),
        type: 'HTTP',
      },
      {
        code: 204,
        name: t('tools.http-status-codes.constants.text.no-content'),
        description: t('tools.http-status-codes.constants.text.the-server-successfully-processed-the-request-and-is-not-returning-any-content'),
        type: 'HTTP',
      },
      {
        code: 205,
        name: t('tools.http-status-codes.constants.text.reset-content'),
        description: t('tools.http-status-codes.constants.text.the-server-indicates-to-reinitialize-the-document-view-which-sent-this-request'),
        type: 'HTTP',
      },
      {
        code: 206,
        name: t('tools.http-status-codes.constants.text.partial-content'),
        description: t('tools.http-status-codes.constants.text.the-server-is-delivering-only-part-of-the-resource-due-to-a-range-header-sent-by-the-client'),
        type: 'HTTP',
      },
      {
        code: 207,
        name: 'Multi-Status',
        description:
          t('tools.http-status-codes.constants.text.the-message-body-that-follows-is-an-xml-message-and-can-contain-a-number-of-separate-response-codes'),
        type: 'WebDav',
      },
      {
        code: 208,
        name: t('tools.http-status-codes.constants.text.already-reported'),
        description:
          t('tools.http-status-codes.constants.text.the-members-of-a-dav-binding-have-already-been-enumerated-in-a-preceding-part-of-the-multistatus-response'),
        type: 'WebDav',
      },
      {
        code: 226,
        name: t('tools.http-status-codes.constants.text.im-used'),
        description:
          t('tools.http-status-codes.constants.text.the-server-has-fulfilled-a-request-for-the-resource-and-the-response-is-a-representation-of-the-result'),
        type: 'HTTP',
      },
    ],
  },
  {
    category: t('tools.http-status-codes.constants.text.3xx-redirection'),
    codes: [
      {
        code: 300,
        name: t('tools.http-status-codes.constants.text.multiple-choices'),
        description: t('tools.http-status-codes.constants.text.indicates-multiple-options-for-the-resource-that-the-client-may-follow'),
        type: 'HTTP',
      },
      {
        code: 301,
        name: t('tools.http-status-codes.constants.text.moved-permanently'),
        description: t('tools.http-status-codes.constants.text.this-and-all-future-requests-should-be-directed-to-the-given-uri'),
        type: 'HTTP',
      },
      {
        code: 302,
        name: t('tools.http-status-codes.constants.text.found'),
        description: t('tools.http-status-codes.constants.text.redirect-to-another-url-this-is-an-example-of-industry-practice-contradicting-the-standard'),
        type: 'HTTP',
      },
      {
        code: 303,
        name: t('tools.http-status-codes.constants.text.see-other'),
        description: t('tools.http-status-codes.constants.text.the-response-to-the-request-can-be-found-under-another-uri-using-a-get-method'),
        type: 'HTTP',
      },
      {
        code: 304,
        name: t('tools.http-status-codes.constants.text.not-modified'),
        description:
          t('tools.http-status-codes.constants.text.indicates-that-the-resource-has-not-been-modified-since-the-version-specified-by-the-request-headers'),
        type: 'HTTP',
      },
      {
        code: 305,
        name: t('tools.http-status-codes.constants.text.use-proxy'),
        description:
          t('tools.http-status-codes.constants.text.the-requested-resource-is-available-only-through-a-proxy-the-address-for-which-is-provided-in-the-response'),
        type: 'HTTP',
      },
      {
        code: 306,
        name: t('tools.http-status-codes.constants.text.switch-proxy'),
        description: t('tools.http-status-codes.constants.text.no-longer-used-originally-meant-subsequent-requests-should-use-the-specified-proxy'),
        type: 'HTTP',
      },
      {
        code: 307,
        name: t('tools.http-status-codes.constants.text.temporary-redirect'),
        description:
          t('tools.http-status-codes.constants.text.in-this-case-the-request-should-be-repeated-with-another-uri-however-future-requests-should-still-use-the-original-uri'),
        type: 'HTTP',
      },
      {
        code: 308,
        name: t('tools.http-status-codes.constants.text.permanent-redirect'),
        description: t('tools.http-status-codes.constants.text.the-request-and-all-future-requests-should-be-repeated-using-another-uri'),
        type: 'HTTP',
      },
    ],
  },
  {
    category: t('tools.http-status-codes.constants.text.4xx-client-error'),
    codes: [
      {
        code: 400,
        name: t('tools.http-status-codes.constants.text.bad-request'),
        description: t('tools.http-status-codes.constants.text.the-server-cannot-or-will-not-process-the-request-due-to-an-apparent-client-error'),
        type: 'HTTP',
      },
      {
        code: 401,
        name: t('tools.http-status-codes.constants.text.unauthorized'),
        description:
          t('tools.http-status-codes.constants.text.similar-to-403-forbidden-but-specifically-for-use-when-authentication-is-required-and-has-failed-or-has-not-yet-been-provided'),
        type: 'HTTP',
      },
      {
        code: 402,
        name: t('tools.http-status-codes.constants.text.payment-required'),
        description:
          t('tools.http-status-codes.constants.text.reserved-for-future-use-the-original-intention-was-that-this-code-might-be-used-as-part-of-some-form-of-digital-cash-or-micropayment-scheme'),
        type: 'HTTP',
      },
      {
        code: 403,
        name: t('tools.http-status-codes.constants.text.forbidden'),
        description:
          t('tools.http-status-codes.constants.text.the-request-was-valid-but-the-server-is-refusing-action-the-user-might-not-have-the-necessary-permissions-for-a-resource'),
        type: 'HTTP',
      },
      {
        code: 404,
        name: t('tools.sip-auth.text.not-found'),
        description: t('tools.http-status-codes.constants.text.the-requested-resource-could-not-be-found-but-may-be-available-in-the-future'),
        type: 'HTTP',
      },
      {
        code: 405,
        name: t('tools.http-status-codes.constants.text.method-not-allowed'),
        description: t('tools.http-status-codes.constants.text.a-request-method-is-not-supported-for-the-requested-resource'),
        type: 'HTTP',
      },
      {
        code: 406,
        name: t('tools.http-status-codes.constants.text.not-acceptable'),
        description:
          t('tools.http-status-codes.constants.text.the-requested-resource-is-capable-of-generating-only-content-not-acceptable-according-to-the-accept-headers-sent-in-the-request'),
        type: 'HTTP',
      },
      {
        code: 407,
        name: t('tools.http-status-codes.constants.text.proxy-authentication-required'),
        description: t('tools.http-status-codes.constants.text.the-client-must-first-authenticate-itself-with-the-proxy'),
        type: 'HTTP',
      },
      {
        code: 408,
        name: t('tools.http-status-codes.constants.text.request-timeout'),
        description: t('tools.http-status-codes.constants.text.the-server-timed-out-waiting-for-the-request'),
        type: 'HTTP',
      },
      {
        code: 409,
        name: t('tools.http-status-codes.constants.text.conflict'),
        description:
          t('tools.http-status-codes.constants.text.indicates-that-the-request-could-not-be-processed-because-of-conflict-in-the-request-such-as-an-edit-conflict'),
        type: 'HTTP',
      },
      {
        code: 410,
        name: t('tools.http-status-codes.constants.text.gone'),
        description: t('tools.http-status-codes.constants.text.indicates-that-the-resource-requested-is-no-longer-available-and-will-not-be-available-again'),
        type: 'HTTP',
      },
      {
        code: 411,
        name: t('tools.http-status-codes.constants.text.length-required'),
        description:
          t('tools.http-status-codes.constants.text.the-request-did-not-specify-the-length-of-its-content-which-is-required-by-the-requested-resource'),
        type: 'HTTP',
      },
      {
        code: 412,
        name: t('tools.http-status-codes.constants.text.precondition-failed'),
        description: t('tools.http-status-codes.constants.text.the-server-does-not-meet-one-of-the-preconditions-that-the-requester-put-on-the-request'),
        type: 'HTTP',
      },
      {
        code: 413,
        name: t('tools.http-status-codes.constants.text.payload-too-large'),
        description: t('tools.http-status-codes.constants.text.the-request-is-larger-than-the-server-is-willing-or-able-to-process'),
        type: 'HTTP',
      },
      {
        code: 414,
        name: t('tools.http-status-codes.constants.text.uri-too-long'),
        description: t('tools.http-status-codes.constants.text.the-uri-provided-was-too-long-for-the-server-to-process'),
        type: 'HTTP',
      },
      {
        code: 415,
        name: t('tools.http-status-codes.constants.text.unsupported-media-type'),
        description: t('tools.http-status-codes.constants.text.the-request-entity-has-a-media-type-which-the-server-or-resource-does-not-support'),
        type: 'HTTP',
      },
      {
        code: 416,
        name: t('tools.http-status-codes.constants.text.range-not-satisfiable'),
        description: t('tools.http-status-codes.constants.text.the-client-has-asked-for-a-portion-of-the-file-but-the-server-cannot-supply-that-portion'),
        type: 'HTTP',
      },
      {
        code: 417,
        name: t('tools.http-status-codes.constants.text.expectation-failed'),
        description: t('tools.http-status-codes.constants.text.the-server-cannot-meet-the-requirements-of-the-expect-request-header-field'),
        type: 'HTTP',
      },
      {
        code: 418,
        name: t('tools.http-status-codes.constants.text.i-m-a-teapot'),
        description: t('tools.http-status-codes.constants.text.the-server-refuses-the-attempt-to-brew-coffee-with-a-teapot'),
        type: 'HTTP',
      },
      {
        code: 421,
        name: t('tools.http-status-codes.constants.text.misdirected-request'),
        description: t('tools.http-status-codes.constants.text.the-request-was-directed-at-a-server-that-is-not-able-to-produce-a-response'),
        type: 'HTTP',
      },
      {
        code: 422,
        name: t('tools.http-status-codes.constants.text.unprocessable-entity'),
        description: t('tools.http-status-codes.constants.text.the-request-was-well-formed-but-was-unable-to-be-followed-due-to-semantic-errors'),
        type: 'HTTP',
      },
      {
        code: 423,
        name: t('tools.http-status-codes.constants.text.locked'),
        description: t('tools.http-status-codes.constants.text.the-resource-that-is-being-accessed-is-locked'),
        type: 'HTTP',
      },
      {
        code: 424,
        name: t('tools.http-status-codes.constants.text.failed-dependency'),
        description: t('tools.http-status-codes.constants.text.the-request-failed-due-to-failure-of-a-previous-request'),
        type: 'HTTP',
      },
      {
        code: 425,
        name: t('tools.http-status-codes.constants.text.too-early'),
        description: t('tools.http-status-codes.constants.text.indicates-that-the-server-is-unwilling-to-risk-processing-a-request-that-might-be-replayed'),
        type: 'HTTP',
      },
      {
        code: 426,
        name: t('tools.http-status-codes.constants.text.upgrade-required'),
        description: t('tools.http-status-codes.constants.text.the-client-should-switch-to-a-different-protocol-such-as-tls-1-0'),
        type: 'HTTP',
      },
      {
        code: 428,
        name: t('tools.http-status-codes.constants.text.precondition-required'),
        description: t('tools.http-status-codes.constants.text.the-origin-server-requires-the-request-to-be-conditional'),
        type: 'HTTP',
      },
      {
        code: 429,
        name: t('tools.http-status-codes.constants.text.too-many-requests'),
        description: t('tools.http-status-codes.constants.text.the-user-has-sent-too-many-requests-in-a-given-amount-of-time'),
        type: 'HTTP',
      },
      {
        code: 431,
        name: t('tools.http-status-codes.constants.text.request-header-fields-too-large'),
        description:
          t('tools.http-status-codes.constants.text.the-server-is-unwilling-to-process-the-request-because-either-an-individual-header-field-or-all-the-header-fields-collectively-are-too-large'),
        type: 'HTTP',
      },
      {
        code: 451,
        name: t('tools.http-status-codes.constants.text.unavailable-for-legal-reasons'),
        description:
          t('tools.http-status-codes.constants.text.a-server-operator-has-received-a-legal-demand-to-deny-access-to-a-resource-or-to-a-set-of-resources-that-includes-the-requested-resource'),
        type: 'HTTP',
      },
    ],
  },
  {
    category: t('tools.http-status-codes.constants.text.5xx-server-error'),
    codes: [
      {
        code: 500,
        name: t('tools.http-status-codes.constants.text.internal-server-error'),
        description:
          t('tools.http-status-codes.constants.text.a-generic-error-message-given-when-an-unexpected-condition-was-encountered-and-no-more-specific-message-is-suitable'),
        type: 'HTTP',
      },
      {
        code: 501,
        name: t('tools.http-status-codes.constants.text.not-implemented'),
        description:
          t('tools.http-status-codes.constants.text.the-server-either-does-not-recognize-the-request-method-or-it-lacks-the-ability-to-fulfill-the-request'),
        type: 'HTTP',
      },
      {
        code: 502,
        name: t('tools.http-status-codes.constants.text.bad-gateway'),
        description:
          t('tools.http-status-codes.constants.text.the-server-was-acting-as-a-gateway-or-proxy-and-received-an-invalid-response-from-the-upstream-server'),
        type: 'HTTP',
      },
      {
        code: 503,
        name: t('tools.http-status-codes.constants.text.service-unavailable'),
        description: t('tools.http-status-codes.constants.text.the-server-is-currently-unavailable-because-it-is-overloaded-or-down-for-maintenance'),
        type: 'HTTP',
      },
      {
        code: 504,
        name: t('tools.http-status-codes.constants.text.gateway-timeout'),
        description:
          t('tools.http-status-codes.constants.text.the-server-was-acting-as-a-gateway-or-proxy-and-did-not-receive-a-timely-response-from-the-upstream-server'),
        type: 'HTTP',
      },
      {
        code: 505,
        name: t('tools.http-status-codes.constants.text.http-version-not-supported'),
        description: t('tools.http-status-codes.constants.text.the-server-does-not-support-the-http-protocol-version-used-in-the-request'),
        type: 'HTTP',
      },
      {
        code: 506,
        name: t('tools.http-status-codes.constants.text.variant-also-negotiates'),
        description: t('tools.http-status-codes.constants.text.transparent-content-negotiation-for-the-request-results-in-a-circular-reference'),
        type: 'HTTP',
      },
      {
        code: 507,
        name: t('tools.http-status-codes.constants.text.insufficient-storage'),
        description: t('tools.http-status-codes.constants.text.the-server-is-unable-to-store-the-representation-needed-to-complete-the-request'),
        type: 'HTTP',
      },
      {
        code: 508,
        name: t('tools.http-status-codes.constants.text.loop-detected'),
        description: t('tools.http-status-codes.constants.text.the-server-detected-an-infinite-loop-while-processing-the-request'),
        type: 'HTTP',
      },
      {
        code: 510,
        name: t('tools.http-status-codes.constants.text.not-extended'),
        description: t('tools.http-status-codes.constants.text.further-extensions-to-the-request-are-required-for-the-server-to-fulfill-it'),
        type: 'HTTP',
      },
      {
        code: 511,
        name: t('tools.http-status-codes.constants.text.network-authentication-required'),
        description: t('tools.http-status-codes.constants.text.the-client-needs-to-authenticate-to-gain-network-access'),
        type: 'HTTP',
      },
    ],
  },
];
