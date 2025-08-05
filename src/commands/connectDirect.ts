import { ConnectionID, ConnectionConfig, ConnectionSettings } from '../types'
import { FileAttributes } from '../FileSystem'
import { ATTRIBUTES as LOCAL_ATTRIBUTES } from '../fs/Local'
import { connectionID } from '../utils/URI'
import Connection from '../Connection'
import Session from '../Session'
import { explorerSettings } from './connect'

/**
 * Direct connection without file system - for in-memory connections
 * Used when connection data is passed directly (e.g., from URL params + postMessage)
 */
export default async function connectDirect(
    config: ConnectionConfig, 
    password: string = '',
    privateKeyContent: string = '',
    onError: (id: ConnectionID, e: any) => void
): Promise<{ id: ConnectionID, sid: string, settings: ConnectionSettings } | false> {

    // Validate required fields
    if (!config.scheme || !config.user || !config.host || !config.port) {
        throw new Error('Missing required connection parameters')
    }

    const id = connectionID(config.scheme, config.user, config.host, config.port)

    // Use provided password or private key content
    let authPassword = password
    let authPrivateKey = privateKeyContent

    // If config has privatekey path but we have content, use content instead
    if (config.privatekey && privateKeyContent) {
        authPrivateKey = privateKeyContent
    }

    // Must have either password or private key
    if (!authPassword && !authPrivateKey) {
        throw new Error('Must provide either password or private key')
    }

    try {
        const attributes = await Connection.open(
            config.scheme, 
            config.user, 
            config.host, 
            config.port, 
            authPassword,
            authPrivateKey // Use content directly instead of file path
        )
        
        const pwd = await Connection.get(id).pwd()
        
        const settings: ConnectionSettings = {
            name: `${config.user}@${config.host}:${config.port}`, // Generate name since no file
            attributes,
            pwd, 
            theme: config.theme ?? 'black',
            local: explorerSettings(LOCAL_ATTRIBUTES, config.local), 
            remote: explorerSettings(attributes, config.remote),
            path: {
                local: config.path?.local,
                remote: config.path?.remote ?? pwd
            },
            sync: config.sync ?? null
        }
        
        return { id, sid: Session.create(), settings }
    } catch (e) {
        onError(id, e)
        return false
    }
}
