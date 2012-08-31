package models;

import play.data.validation.Required;
import play.db.jpa.Model;

import javax.persistence.Embedded;
import javax.persistence.Entity;

@Entity
public class Client extends Model
{
    @Embedded
    public Partner partner;

    // TODO
    // adauga alte informatii care pot fi schimbate
}
