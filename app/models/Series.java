package models;

import play.data.validation.MaxSize;
import play.data.validation.Required;
import play.db.jpa.Model;

import javax.persistence.Entity;

/**
 * User: alinc
 * Date: 4/26/12
 * Time: 8:28 PM
 */
@Entity
public class Series extends Model
{
    @MaxSize(10)
    public String docType;

    @MaxSize(10)
    public String prefix;

    @MaxSize(10)
    public String suffix;

    @Required
    public int currentNumber = 0;

    public boolean enabled;

    public String getNextSeries()
    {
        currentNumber++;
        save();
        return String.format("%s%s%s", prefix, currentNumber,suffix);
    }
}
