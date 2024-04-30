export type Farm = {
  "version": "0.0.1",
  "name": "farm",
  "constants": [
    {
      "name": "FARM_SEED",
      "type": "string",
      "value": "\"Farm\""
    },
    {
      "name": "POOL_SEED",
      "type": "string",
      "value": "\"Pool\""
    },
    {
      "name": "VALUT_SEED",
      "type": "string",
      "value": "\"Vault\""
    },
    {
      "name": "DEPOSITION_SEED",
      "type": "string",
      "value": "\"Deposition\""
    }
  ],
  "instructions": [
    {
      "name": "initializeFarm",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "farmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "operator",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "addOperator",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "farmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "operator",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "removeOperator",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "farmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "operator",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "createTokenVault",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "farmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createTokenPool",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "farmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "PoolArg"
          }
        }
      ]
    },
    {
      "name": "updateTokenPool",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "farmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "PoolArg"
          }
        }
      ]
    },
    {
      "name": "createSolPool",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "farmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "PoolArg"
          }
        }
      ]
    },
    {
      "name": "updaeSolPool",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "farmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "PoolArg"
          }
        }
      ]
    },
    {
      "name": "emergencyWithdrawSol",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "farmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK, receive sol"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "emergencyWithdrawToken",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "farmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK, receive toekn"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositSol",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "arg",
          "type": {
            "defined": "DepositionArg"
          }
        }
      ]
    },
    {
      "name": "depositToken",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "arg",
          "type": {
            "defined": "DepositionArg"
          }
        }
      ]
    },
    {
      "name": "withdrawToken",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "arg",
          "type": {
            "defined": "DepositionArg"
          }
        }
      ]
    },
    {
      "name": "withdrawSol",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "arg",
          "type": {
            "defined": "DepositionArg"
          }
        }
      ]
    },
    {
      "name": "refreshRewards",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "depositTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userRewardTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "depositionAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lastCalculateTime",
            "type": "u32"
          },
          {
            "name": "fixed",
            "type": {
              "defined": "FixedDeposition"
            }
          },
          {
            "name": "flexible",
            "type": {
              "defined": "FlexibleDeposition"
            }
          },
          {
            "name": "nfts",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "farmAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "operators",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "pools",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "poolAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startTime",
            "type": "u32"
          },
          {
            "name": "endTime",
            "type": "u32"
          },
          {
            "name": "amount",
            "type": "i128"
          },
          {
            "name": "weight",
            "type": "i128"
          },
          {
            "name": "poolType",
            "type": "u8"
          },
          {
            "name": "rewardConfigs",
            "type": {
              "vec": {
                "defined": "RewardConfig"
              }
            }
          },
          {
            "name": "lockConfigs",
            "type": {
              "vec": {
                "defined": "LockConfig"
              }
            }
          },
          {
            "name": "nftConfigs",
            "type": {
              "vec": {
                "defined": "NftConfig"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "DepositionArg",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "lockWeeks",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "PoolArg",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolType",
            "type": "u8"
          },
          {
            "name": "startTime",
            "type": "u32"
          },
          {
            "name": "endTime",
            "type": "u32"
          },
          {
            "name": "rewardConfigs",
            "type": {
              "vec": {
                "defined": "RewardConfig"
              }
            }
          },
          {
            "name": "lockConfigs",
            "type": {
              "vec": {
                "defined": "LockConfig"
              }
            }
          },
          {
            "name": "nftConfigs",
            "type": {
              "vec": {
                "defined": "NftConfig"
              }
            }
          }
        ]
      }
    },
    {
      "name": "Reward",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "i128"
          }
        ]
      }
    },
    {
      "name": "FixedDeposition",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startTime",
            "type": "u32"
          },
          {
            "name": "lockWeeks",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "i128"
          },
          {
            "name": "weight",
            "type": "i128"
          },
          {
            "name": "rewards",
            "type": {
              "vec": {
                "defined": "Reward"
              }
            }
          }
        ]
      }
    },
    {
      "name": "FlexibleDeposition",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "i128"
          },
          {
            "name": "weight",
            "type": "i128"
          },
          {
            "name": "rewards",
            "type": {
              "vec": {
                "defined": "Reward"
              }
            }
          }
        ]
      }
    },
    {
      "name": "RewardConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "startTime",
            "type": "u32"
          },
          {
            "name": "endTime",
            "type": "u32"
          },
          {
            "name": "weeklyRewards",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "LockConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lockWeeks",
            "type": "u8"
          },
          {
            "name": "multiplier",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "NftConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "multiplier",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidTokenAmount",
      "msg": "invalid token amount"
    },
    {
      "code": 6001,
      "name": "InvalidLockWeeks",
      "msg": "invalid lock weeks."
    },
    {
      "code": 6002,
      "name": "ExceedMaxAmount",
      "msg": "."
    },
    {
      "code": 6003,
      "name": "InvalidAccess",
      "msg": "invalid access"
    }
  ]
};

export const IDL: Farm = {
  "version": "0.0.1",
  "name": "farm",
  "constants": [
    {
      "name": "FARM_SEED",
      "type": "string",
      "value": "\"Farm\""
    },
    {
      "name": "POOL_SEED",
      "type": "string",
      "value": "\"Pool\""
    },
    {
      "name": "VALUT_SEED",
      "type": "string",
      "value": "\"Vault\""
    },
    {
      "name": "DEPOSITION_SEED",
      "type": "string",
      "value": "\"Deposition\""
    }
  ],
  "instructions": [
    {
      "name": "initializeFarm",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "farmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "operator",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "addOperator",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "farmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "operator",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "removeOperator",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "farmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "operator",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "createTokenVault",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "farmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createTokenPool",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "farmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "PoolArg"
          }
        }
      ]
    },
    {
      "name": "updateTokenPool",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "farmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "PoolArg"
          }
        }
      ]
    },
    {
      "name": "createSolPool",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "farmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "PoolArg"
          }
        }
      ]
    },
    {
      "name": "updaeSolPool",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "farmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "PoolArg"
          }
        }
      ]
    },
    {
      "name": "emergencyWithdrawSol",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "farmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK, receive sol"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "emergencyWithdrawToken",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "farmAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK, receive toekn"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositSol",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "arg",
          "type": {
            "defined": "DepositionArg"
          }
        }
      ]
    },
    {
      "name": "depositToken",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "arg",
          "type": {
            "defined": "DepositionArg"
          }
        }
      ]
    },
    {
      "name": "withdrawToken",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "arg",
          "type": {
            "defined": "DepositionArg"
          }
        }
      ]
    },
    {
      "name": "withdrawSol",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "arg",
          "type": {
            "defined": "DepositionArg"
          }
        }
      ]
    },
    {
      "name": "refreshRewards",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "depositTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "depositionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userRewardTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "depositionAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lastCalculateTime",
            "type": "u32"
          },
          {
            "name": "fixed",
            "type": {
              "defined": "FixedDeposition"
            }
          },
          {
            "name": "flexible",
            "type": {
              "defined": "FlexibleDeposition"
            }
          },
          {
            "name": "nfts",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "farmAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "operators",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "pools",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "poolAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startTime",
            "type": "u32"
          },
          {
            "name": "endTime",
            "type": "u32"
          },
          {
            "name": "amount",
            "type": "i128"
          },
          {
            "name": "weight",
            "type": "i128"
          },
          {
            "name": "poolType",
            "type": "u8"
          },
          {
            "name": "rewardConfigs",
            "type": {
              "vec": {
                "defined": "RewardConfig"
              }
            }
          },
          {
            "name": "lockConfigs",
            "type": {
              "vec": {
                "defined": "LockConfig"
              }
            }
          },
          {
            "name": "nftConfigs",
            "type": {
              "vec": {
                "defined": "NftConfig"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "DepositionArg",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "lockWeeks",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "PoolArg",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolType",
            "type": "u8"
          },
          {
            "name": "startTime",
            "type": "u32"
          },
          {
            "name": "endTime",
            "type": "u32"
          },
          {
            "name": "rewardConfigs",
            "type": {
              "vec": {
                "defined": "RewardConfig"
              }
            }
          },
          {
            "name": "lockConfigs",
            "type": {
              "vec": {
                "defined": "LockConfig"
              }
            }
          },
          {
            "name": "nftConfigs",
            "type": {
              "vec": {
                "defined": "NftConfig"
              }
            }
          }
        ]
      }
    },
    {
      "name": "Reward",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "i128"
          }
        ]
      }
    },
    {
      "name": "FixedDeposition",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startTime",
            "type": "u32"
          },
          {
            "name": "lockWeeks",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "i128"
          },
          {
            "name": "weight",
            "type": "i128"
          },
          {
            "name": "rewards",
            "type": {
              "vec": {
                "defined": "Reward"
              }
            }
          }
        ]
      }
    },
    {
      "name": "FlexibleDeposition",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "i128"
          },
          {
            "name": "weight",
            "type": "i128"
          },
          {
            "name": "rewards",
            "type": {
              "vec": {
                "defined": "Reward"
              }
            }
          }
        ]
      }
    },
    {
      "name": "RewardConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "startTime",
            "type": "u32"
          },
          {
            "name": "endTime",
            "type": "u32"
          },
          {
            "name": "weeklyRewards",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "LockConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lockWeeks",
            "type": "u8"
          },
          {
            "name": "multiplier",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "NftConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "multiplier",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidTokenAmount",
      "msg": "invalid token amount"
    },
    {
      "code": 6001,
      "name": "InvalidLockWeeks",
      "msg": "invalid lock weeks."
    },
    {
      "code": 6002,
      "name": "ExceedMaxAmount",
      "msg": "."
    },
    {
      "code": 6003,
      "name": "InvalidAccess",
      "msg": "invalid access"
    }
  ]
};
